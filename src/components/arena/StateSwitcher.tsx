"use client";

import { arenaStates, ArenaStateKey } from "@/lib/arena/states";

export default function StateSwitcher({
  current,
  onChange,
}: {
  current: ArenaStateKey;
  onChange: (key: ArenaStateKey) => void;
}) {
  return (
    <div className="arena-glass rounded-full p-1.5">
      <p className="px-3 pt-1 text-[10px] tracking-wide text-[var(--arena-muted)]">
        DEMO · 시간대별 상태 미리보기
      </p>
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-1 pb-1">
        {arenaStates.map((s) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors"
            style={{
              background: current === s.key ? s.accent : "transparent",
              color: current === s.key ? "#05060a" : "var(--arena-muted)",
              fontWeight: current === s.key ? 700 : 400,
            }}
          >
            {s.demoLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
