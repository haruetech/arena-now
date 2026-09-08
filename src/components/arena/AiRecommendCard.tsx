const suggestions = [
  { label: "주차 정보", href: "#park" },
  { label: "맛집 추천", href: "#eat" },
  { label: "짐보관", href: "#painpoints" },
  { label: "귀가 교통", href: "#after" },
];

// NOW AI(PredictiveAI)를 짧게 압축한 프로모션 카드. 아래 #now-ai 섹션에서
// 이동수단·상태별로 더 자세한 추천을 볼 수 있습니다.
export default function AiRecommendCard({ accent }: { accent: string }) {
  return (
    <div className="arena-glass-strong flex h-full flex-col rounded-xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)" }}>
          🤖 AI 추천
        </p>
        <a href="#now-ai" className="text-[10px] text-[var(--arena-muted)] hover:text-white">
          전체보기 ›
        </a>
      </div>

      <div
        className="flex flex-1 flex-col justify-between gap-3 rounded-lg p-4"
        style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}0d)` }}
      >
        <div>
          <p className="text-sm font-bold leading-snug">
            공연 가는 날,
            <br />
            이런 서비스도 필요하신가요?
          </p>
          <p className="mt-2 text-[11px] text-[var(--arena-muted)]">
            AI가 지금 상황에 맞는 정보를 추천해드립니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] hover:border-white/40"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
