"use client";

export type ArenaMode = "auto" | "demo";

export default function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: ArenaMode;
  onChange: (m: ArenaMode) => void;
}) {
  return (
    <div className="arena-glass inline-flex gap-1 rounded-full p-1 text-xs">
      <button
        onClick={() => onChange("auto")}
        className="rounded-full px-3 py-1.5 transition-colors"
        style={{
          background: mode === "auto" ? "#ffffff" : "transparent",
          color: mode === "auto" ? "#05060a" : "var(--arena-muted)",
          fontWeight: mode === "auto" ? 700 : 400,
        }}
      >
        자동 계산
      </button>
      <button
        onClick={() => onChange("demo")}
        className="rounded-full px-3 py-1.5 transition-colors"
        style={{
          background: mode === "demo" ? "#ffffff" : "transparent",
          color: mode === "demo" ? "#05060a" : "var(--arena-muted)",
          fontWeight: mode === "demo" ? 700 : 400,
        }}
      >
        데모로 미리보기
      </button>
    </div>
  );
}
