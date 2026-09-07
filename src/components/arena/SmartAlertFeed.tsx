"use client";

import { alertMoments, getAlertIndex } from "@/lib/arena/alerts";
import { ArenaStateKey } from "@/lib/arena/states";

// SMART ALERT: 문제가 생기기 전에 먼저 알려주는 예방형 알림 타임라인.
// 지금 지나온 알림은 체크 표시, 지금 알림은 강조, 앞으로 올 알림은 미리보기로 흐리게.
export default function SmartAlertFeed({
  stateKey,
  accent,
}: {
  stateKey: ArenaStateKey;
  accent: string;
}) {
  const currentIndex = getAlertIndex(stateKey);

  return (
    <section id="alert" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">SMART ALERT</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        불편이 생기기 전에, 먼저 알려드립니다
      </h2>
      <p className="mb-8 text-sm text-[var(--arena-muted)]">
        공연 알림이 아니라, 지금 뭘 하면 좋을지 알려주는 예방형 알림입니다.
      </p>

      <div className="flex flex-col gap-2">
        {alertMoments.map((m, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div
              key={m.stateKey}
              className={`flex items-start gap-4 rounded-md p-4 transition-all ${isCurrent ? "arena-glass-strong" : isPast ? "opacity-40" : "arena-glass opacity-70"}`}
              style={isCurrent ? { borderColor: `${accent}66` } : undefined}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]"
                style={{
                  background: isPast ? "transparent" : isCurrent ? accent : "var(--arena-glass)",
                  border: `1px solid ${isPast ? "var(--arena-border)" : isCurrent ? accent : "var(--arena-border)"}`,
                  color: isCurrent ? "#05060a" : "var(--arena-muted)",
                }}
              >
                {isPast ? "✓" : i + 1}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--arena-font-display)", color: isCurrent ? accent : "var(--arena-text)" }}
                  >
                    {m.title}
                  </p>
                  {isCurrent && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] tracking-wide"
                      style={{ background: `${accent}22`, color: accent }}
                    >
                      NOW
                    </span>
                  )}
                  <span className="text-[10px] text-[var(--arena-muted)]">{m.tag}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--arena-muted)]">{m.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
