"use client";

import { useEffect, useState } from "react";

// 오늘 공연 정보 + 실시간 카운트다운. 예시 공연(오늘 19:00~21:30) 기준입니다.
export default function TodayShowCard({ showStart, accent }: { showStart: Date; accent: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const diffMs = showStart.getTime() - now.getTime();
  const isPast = diffMs <= 0;
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");

  const dateLabel = showStart.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const timeLabel = showStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div className="arena-glass-strong max-w-xs rounded-xl p-4">
      <p className="text-[10px] tracking-widest text-[var(--arena-muted)]">TODAY</p>
      <p className="mt-1 text-sm font-bold" style={{ fontFamily: "var(--arena-font-display)" }}>
        K-POP SPECIAL CONCERT
      </p>
      <p className="mt-1 text-[11px] text-[var(--arena-muted)]">
        {dateLabel} {timeLabel} · 예시 공연장(DEMO)
      </p>

      {!isPast ? (
        <div className="mt-3 flex items-end gap-3">
          {[
            { label: "HOURS", value: h },
            { label: "MINS", value: m },
            { label: "SECS", value: s },
          ].map((u) => (
            <div key={u.label}>
              <p className="text-2xl font-bold tabular-nums" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
                {u.value}
              </p>
              <p className="text-[9px] tracking-widest text-[var(--arena-muted)]">{u.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm" style={{ color: accent }}>
          공연이 진행 중이거나 종료됐습니다
        </p>
      )}
    </div>
  );
}
