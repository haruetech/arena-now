import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const KMA_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php";
const SEOUL_STATION = "108"; // 기상청 서울 ASOS 관측지점

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

function parseKmaText(text: string) {
  const lines = text.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
  // help=1 응답에서 '# TM STN ...' 형태의 컬럼 헤더를 찾습니다.
  const headerLine = [...lines].reverse().find((line) => /^#\s*TM\s+STN\b/.test(line));
  const dataLine = lines.find((line) => !line.startsWith("#") && /^\d{12}\s+\d+\s+/.test(line));
  if (!headerLine || !dataLine) throw new Error("KMA response format not recognized");

  const headers = headerLine.replace(/^#\s*/, "").split(/\s+/);
  const values = dataLine.split(/\s+/);
  const row: Record<string, string> = {};
  headers.forEach((key, i) => { row[key] = values[i]; });

  const num = (key: string) => {
    const v = Number(row[key]);
    return Number.isFinite(v) && v > -90 ? v : null;
  };

  const temperature = num("TA");
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

export async function GET() {
  const authKey = process.env.KMA_API_KEY;
  if (!authKey) {
    return NextResponse.json({ ok: false, error: "KMA_API_KEY is not configured" }, { status: 503 });
  }

  try {
    const url = new URL(KMA_URL);
    url.searchParams.set("stn", SEOUL_STATION);
    url.searchParams.set("help", "1");
    url.searchParams.set("authKey", authKey);

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`KMA HTTP ${response.status}`);
    const text = await response.text();
    const weather = parseKmaText(text);

    return NextResponse.json({ ok: true, ...weather }, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("KMA weather error", error);
    return NextResponse.json({ ok: false, error: "Weather data temporarily unavailable" }, { status: 502 });
  }
}
