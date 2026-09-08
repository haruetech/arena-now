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
};

export default function WeatherWidget({ desktop = false }: { desktop?: boolean }) {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => fetch("/api/weather", { cache: "no-store" })
      .then((r) => r.json())
      .then((v) => active && setData(v))
      .catch(() => active && setData({ ok: false }));
    load();
    const timer = window.setInterval(load, 10 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const temp = data?.ok && data.temperature != null ? `${Math.round(data.temperature)}°C` : "--°C";
  const condition = data?.ok ? (data.condition || "현재 관측") : "날씨 확인 중";
  const icon = data?.ok ? (data.icon || "🌡️") : "🌡️";

  if (desktop) {
    return (
      <div className="pointer-events-auto flex min-w-[185px] items-center gap-2 rounded-xl border border-white/10 bg-[#06111e]/92 px-3 py-2 text-[10px] text-white/60 shadow-xl backdrop-blur-md" title={data?.ok ? `기상청 ${data.station || "서울"} 관측 · 습도 ${data.humidity ?? "-"}% · 풍속 ${data.windSpeed ?? "-"}m/s` : "기상청 날씨를 불러오는 중입니다."}>
        <span className="text-xl">{icon}</span>
        <div className="leading-tight">
          <p className="font-bold text-white">서울아레나 {temp}</p>
          <p>{condition} · 기상청 관측</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 text-[10px] text-[var(--arena-muted)] sm:flex">
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <p className="text-white">서울아레나 {temp}</p>
        <p>{condition} · 기상청</p>
      </div>
    </div>
  );
}
