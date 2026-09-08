import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const KMA_NOW_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php";
const KMA_RANGE_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm3.php";
const SEOUL_STATION = "108";

const FIELD_ORDER = [
  "TM","STN","WD","WS","GST_WD","GST_WS","GST_TM","PA","PS","PT","PR","TA","TD","HM","PV","RN","RN_DAY","RN_INT",
  "SD_HR3","SD_DAY","SD_TOT","WC","WP","WW","CA_TOT","CA_MID","CH_MIN","CT","CT_TOP","CT_MID","CT_LOW","VS","SS","SI",
  "ST_GD","TS","TE_005","TE_01","TE_02","TE_03","ST_SEA","WH","BF","IR","IX","RN_JUN",
];

function weatherLabel(rain: number | null, cloud: number | null) {
  if (rain !== null && rain > 0) return "비";
  if (cloud === null) return "현재 관측";
  if (cloud <= 2) return "맑음";
  if (cloud <= 5) return "구름조금";
  if (cloud <= 8) return "구름많음";
  return "흐림";
}

function iconFor(label: string) {
  if (label === "비") return "🌧️";
  if (label === "맑음") return "☀️";
  if (label.includes("구름")) return "🌤️";
  if (label === "흐림") return "☁️";
  return "🌡️";
}

function kstDate(hoursAgo = 0) {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
}

function kstTm(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${value("year")}${value("month")}${value("day")}${value("hour")}${value("minute")}`;
}

async function decodeKma(response: Response) {
  const buffer = await response.arrayBuffer();
  // KMA typ01 legacy endpoints commonly return Korean comments in EUC-KR.
  // Decoding correctly also keeps error messages readable while ASCII data stays intact.
  try {
    return new TextDecoder("euc-kr").decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

function parseKmaText(text: string) {
  const lines = text.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
  const headerLine = [...lines].reverse().find(
    (line) => line.startsWith("#") && /\bTM\b/.test(line) && /\bSTN\b/.test(line) && /\bTA\b/.test(line)
  );
  const dataLines = lines.filter((line) => !line.startsWith("#") && /^\d{8,12}\s+108\b/.test(line));
  const dataLine = dataLines.at(-1);

  if (!dataLine) {
    const readable = lines.find((line) => !line.startsWith("#START") && !/^#-+$/.test(line) && !line.startsWith("#7777"));
    throw new Error(readable ? `기상청 응답: ${readable.slice(0, 150)}` : "기상청 관측자료가 아직 준비되지 않았습니다.");
  }

  const values = dataLine.split(/\s+/);
  const headers = headerLine
    ? headerLine.replace(/^#+\s*/, "").trim().split(/\s+/)
    : FIELD_ORDER;

  const row: Record<string, string> = {};
  headers.forEach((key, i) => { if (values[i] !== undefined) row[key] = values[i]; });

  const num = (key: string) => {
    const raw = row[key];
    if (raw == null || raw === "") return null;
    const v = Number(raw);
    // KMA missing values are negative sentinels such as -9, -99, -999.
    if (!Number.isFinite(v) || [-9, -99, -999, -9999].includes(v)) return null;
    return v;
  };

  const temperature = num("TA");
  if (temperature === null) throw new Error("기상청 응답에서 기온 값을 찾지 못했습니다.");

  const humidity = num("HM");
  const windSpeed = num("WS");
  const rain = num("RN");
  const cloud = num("CA_TOT");
  const condition = weatherLabel(rain, cloud);

  return {
    location: "서울아레나",
    station: "서울(108)",
    observedAt: row.TM ?? null,
    temperature,
    humidity,
    windSpeed,
    rain,
    cloud,
    condition,
    icon: iconFor(condition),
    source: "기상청",
  };
}

async function request(url: URL) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "ARENA-NOW/1.0" },
  });
  const text = await decodeKma(response);
  if (!response.ok) throw new Error(`기상청 HTTP ${response.status}: ${text.slice(0, 120)}`);
  return parseKmaText(text);
}

async function fetchLatest(authKey: string) {
  // 1) Best path: omit tm. KMA's official spec says this means current time.
  const current = new URL(KMA_NOW_URL);
  current.searchParams.set("stn", SEOUL_STATION);
  current.searchParams.set("help", "0");
  current.searchParams.set("authKey", authKey);
  try { return await request(current); } catch (error) { console.error("KMA current observation failed", error); }

  // 2) Retry recent completed hours.
  for (const hoursAgo of [1, 2, 3, 4, 5, 6]) {
    const url = new URL(KMA_NOW_URL);
    const d = kstDate(hoursAgo);
    d.setMinutes(0, 0, 0);
    url.searchParams.set("tm", kstTm(d));
    url.searchParams.set("stn", SEOUL_STATION);
    url.searchParams.set("help", "0");
    url.searchParams.set("authKey", authKey);
    try { return await request(url); } catch (error) { console.error(`KMA -${hoursAgo}h failed`, error); }
  }

  // 3) Final fallback: range endpoint and use the latest returned row.
  const end = kstDate(1); end.setMinutes(0, 0, 0);
  const start = new Date(end.getTime() - 6 * 60 * 60 * 1000);
  const range = new URL(KMA_RANGE_URL);
  range.searchParams.set("tm1", kstTm(start));
  range.searchParams.set("tm2", kstTm(end));
  range.searchParams.set("stn", SEOUL_STATION);
  range.searchParams.set("help", "0");
  range.searchParams.set("authKey", authKey);
  return request(range);
}

export async function GET() {
  const authKey = process.env.KMA_API_KEY?.trim();
  if (!authKey) {
    return NextResponse.json({ ok: false, error: "KMA_API_KEY is not configured", code: "NO_KEY" }, { status: 503 });
  }

  try {
    const weather = await fetchLatest(authKey);
    return NextResponse.json(
      { ok: true, ...weather },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("KMA weather unavailable", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Weather data temporarily unavailable", code: "KMA_UNAVAILABLE" },
      { status: 502 }
    );
  }
}
