const eatWindows = [
  { window: "120분 전", label: "여유있는 식사", example: "아레나 3층 레스토랑" },
  { window: "90분 전", label: "빠른 식사", example: "푸드코트 · 분식" },
  { window: "60분 전", label: "현장 먹거리", example: "팝업 푸드트럭" },
];

const arenaZone = [
  { name: "팬 포토존", type: "이벤트", time: "상시" },
  { name: "굿즈 팝업 스토어", type: "MD", time: "공연 3시간 전~" },
  { name: "K-라이스 디저트 트럭", type: "푸드트럭", time: "공연 2시간 전~" },
];

// EAT: 공연시간까지 남은 시간 기준으로 추천 (네이버지도와의 차별점).
// ARENA ZONE: 그날 현장에서만 열리는 팝업/이벤트 — 운영자 등록 + 제보 기반.
export default function EatArenaZoneSection({ accent }: { accent: string }) {
  return (
    <section id="eat" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">EAT</p>
      <h2 className="mb-6 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        남은 시간에 맞는 식사를 추천합니다
      </h2>

      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        {eatWindows.map((w) => (
          <div key={w.window} className="arena-glass rounded-md p-4">
            <p className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
              {w.window}
            </p>
            <p className="mt-2 text-sm">{w.label}</p>
            <p className="mt-1 text-xs text-[var(--arena-muted)]">{w.example}</p>
          </div>
        ))}
      </div>

      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">ARENA ZONE</p>
      <h3 className="mb-4 text-lg" style={{ fontFamily: "var(--arena-font-display)" }}>
        오늘 현장 행사, 한눈에
      </h3>
      <div className="flex flex-col gap-2">
        {arenaZone.map((z) => (
          <div key={z.name} className="arena-glass flex items-center justify-between rounded-md p-3.5">
            <div>
              <p className="text-sm">{z.name}</p>
              <p className="mt-0.5 text-[11px] text-[var(--arena-muted)]">{z.type}</p>
            </div>
            <span className="text-[11px] text-[var(--arena-muted)]">{z.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
