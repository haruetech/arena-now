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
};

export default function WeatherWidget({ desktop = false, mobile = false }: { desktop?: boolean; mobile?: boolean }) {
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
  const temp = available ? `${Math.round(data!.temperature!)}°C` : "--°C";
  const condition = available ? (data?.condition || "현재 관측") : (loading ? "날씨 불러오는 중" : "잠시 후 다시 확인");
  const icon = available ? (data?.icon || "🌡️") : (loading ? "⏳" : "🌤️");
  const sub = available
    ? `${condition}${data?.humidity != null ? ` · 습도 ${Math.round(data.humidity)}%` : ""}`
    : "기상청 관측 연결 중";

  if (mobile) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-300/20 bg-[#07182a]/95 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm font-black text-white">서울아레나 {temp}</p>
            <p className="mt-0.5 text-[10px] text-white/55">{sub}</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white/65">실시간</span>
      </div>
    );
  }

  if (desktop) {
    return (
      <div
        className="pointer-events-auto flex min-w-[178px] items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#06111e]/95 px-3 py-2 text-[10px] text-white/65 shadow-xl backdrop-blur-md"
        title={available ? `기상청 ${data?.station || "서울"} 관측` : data?.error || "기상청 연결 중"}
        aria-label="서울아레나 현재 날씨"
      >
        <span className="text-xl">{icon}</span>
        <div className="leading-tight">
          <p className="font-bold text-white">서울아레나 {temp}</p>
          <p>{condition}{available ? " · 기상청" : ""}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[10px] text-[var(--arena-muted)]" title={data?.error || "서울아레나 날씨"}>
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <p className="text-white">서울아레나 {temp}</p>
        <p>{condition}</p>
      </div>
    </div>
  );
}
