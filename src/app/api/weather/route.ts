import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const KMA_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php";
const SEOUL_STATION = "108"; // 서울 ASOS. 서울아레나의 안정적인 현재 관측 기준점.

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

function kstTm(hoursAgo = 1) {
  // ASOS hourly data may be published with a short delay. Asking for the
  // previous completed hour is more reliable than requesting the current minute.
  const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${value("year")}${value("month")}${value("day")}${value("hour")}00`;
}

function parseKmaText(text: string) {
  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.map((v) => v.trim()).filter(Boolean);

  // API error messages are plain text, so expose a useful server-side error.
  const lower = text.toLowerCase();
  if (lower.includes("auth") && (lower.includes("fail") || lower.includes("error"))) {
    throw new Error("KMA authentication failed");
  }

  // help=1 normally provides '# TM STN ... TA ...'. Be tolerant of extra
  // comments and spacing because the legacy text endpoint is not JSON.
  const headerLine = [...lines].reverse().find(
    (line) => line.startsWith("#") && /\bTM\b/.test(line) && /\bSTN\b/.test(line) && /\bTA\b/.test(line)
  );
  const dataLine = lines.find(
    (line) => !line.startsWith("#") && /^\d{8,12}\s+\d+\b/.test(line)
  );

  if (!headerLine || !dataLine) {
    throw new Error(`KMA response format not recognized: ${text.slice(0, 160)}`);
  }

  const headers = headerLine.replace(/^#+\s*/, "").trim().split(/\s+/);
  const values = dataLine.trim().split(/\s+/);
  const row: Record<string, string> = {};
  headers.forEach((key, i) => { if (values[i] !== undefined) row[key] = values[i]; });

  const num = (key: string) => {
    const raw = row[key];
    if (raw == null || raw === "") return null;
    const v = Number(raw);
    return Number.isFinite(v) && v > -90 ? v : null;
  };

  const temperature = num("TA");
  if (temperature === null) throw new Error("KMA temperature is missing");

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

async function fetchObservation(authKey: string, hoursAgo: number) {
  const url = new URL(KMA_URL);
  url.searchParams.set("tm", kstTm(hoursAgo));
  url.searchParams.set("stn", SEOUL_STATION);
  url.searchParams.set("help", "1");
  url.searchParams.set("authKey", authKey);

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "ARENA-NOW/1.0" },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`KMA HTTP ${response.status}: ${text.slice(0, 100)}`);
  return parseKmaText(text);
}

export async function GET() {
  const authKey = process.env.KMA_API_KEY?.trim();
  if (!authKey) {
    return NextResponse.json(
      { ok: false, error: "KMA_API_KEY is not configured", code: "NO_KEY" },
      { status: 503 }
    );
  }

  let lastError: unknown = null;
  // Try the latest completed hours because some KMA station values arrive late.
  for (const hoursAgo of [1, 2, 3, 4]) {
    try {
      const weather = await fetchObservation(authKey, hoursAgo);
      return NextResponse.json(
        { ok: true, ...weather },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } }
      );
    } catch (error) {
      lastError = error;
      console.error(`KMA weather attempt -${hoursAgo}h failed`, error);
    }
  }

  return NextResponse.json(
    {
      ok: false,
      error: lastError instanceof Error ? lastError.message : "Weather data temporarily unavailable",
      code: "KMA_UNAVAILABLE",
    },
    { status: 502 }
  );
}
