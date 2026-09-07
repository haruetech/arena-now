"use client";

import { TransportMode } from "@/lib/arena/predict";

const items: { key: TransportMode; label: string; sub: string }[] = [
  { key: "car", label: "자가용", sub: "주차 우선" },
  { key: "transit", label: "대중교통", sub: "도착시간 우선" },
  { key: "taxi", label: "택시", sub: "승하차 우선" },
];

export default function TransportSelector({
  value,
  onChange,
}: {
  value: TransportMode | null;
  onChange: (v: TransportMode) => void;
}) {
  return (
    <div className="arena-glass grid grid-cols-3 gap-1 rounded-2xl p-1.5" aria-label="이동수단 선택">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 transition-colors"
          style={{
            background: value === item.key ? "#ffffff" : "transparent",
            color: value === item.key ? "#05060a" : "var(--arena-muted)",
          }}
        >
          <strong className="text-sm">{item.label}</strong>
          <span className="text-[10px]">{item.sub}</span>
        </button>
      ))}
    </div>
  );
}
