"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  ok: boolean;
  location?: string;
  station?: string;
  observedAt?: string | null;
  temperature?: number | null;
  humidity?: number | null;
  windSpeed?: number | null;
  rain?: number | null;
  condition?: string;
  icon?: string;
  source?: string;
  error?: string;
  code?: string;
};

export default function WeatherWidget({ desktop = false }: { desktop?: boolean }) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/weather?t=${Date.now()}`, { cache: "no-store" });
        const v = (await r.json()) as WeatherData;
        if (active) setData(v);
      } catch {
        if (active) setData({ ok: false, error: "network" });
      }
    };
    load();
    const timer = window.setInterval(load, 5 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const loading = data === null;
  const available = Boolean(data?.ok && data.temperature != null);
  const temp = available ? `${Math.round(data!.temperature!)}°C` : "";
  const condition = available ? (data?.condition || "현재 관측") : (loading ? "날씨 불러오는 중" : "기상청 연결 확인");
  const icon = available ? (data?.icon || "🌡️") : (loading ? "⏳" : "🌡️");

  const title = available
    ? `기상청 ${data?.station || "서울"} 관측 · 습도 ${data?.humidity ?? "-"}% · 풍속 ${data?.windSpeed ?? "-"}m/s`
    : `날씨를 불러오지 못했습니다${data?.error ? ` · ${data.error}` : ""}`;

  if (desktop) {
    return (
      <a
        href="/api/weather"
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto flex min-w-[178px] items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#06111e]/95 px-3 py-2 text-[10px] text-white/65 shadow-xl backdrop-blur-md hover:border-cyan-300/40"
        title={title}
        aria-label="서울아레나 현재 날씨"
      >
        <span className="text-xl">{icon}</span>
        <div className="leading-tight">
          <p className="font-bold text-white">서울아레나 {temp}</p>
          <p>{condition}{available ? " · 기상청" : ""}</p>
        </div>
      </a>
    );
  }

  return (
    <div className="hidden items-center gap-2 text-[10px] text-[var(--arena-muted)] sm:flex" title={title}>
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <p className="text-white">서울아레나 {temp}</p>
        <p>{condition}</p>
      </div>
    </div>
  );
}
