const chips = [
  { icon: "☕", label: "맛집·카페", sub: "맛있는 즐거움", href: "#eat" },
  { icon: "🎒", label: "짐보관 서비스", sub: "안전한 보관", href: "#painpoints" },
  { icon: "🚌", label: "귀가 교통", sub: "택시·셔틀버스", href: "#after" },
  { icon: "🎁", label: "이벤트·기념품", sub: "특별한 추억", href: "#eat" },
];

// 하단 프로모션 배너 — 공연 전후 부가 서비스로 자연스럽게 유도.
export default function PromoBanner({ accent }: { accent: string }) {
  return (
    <div className="mx-auto w-full max-w-[1560px] px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <a
          href="#eat"
          className="arena-glass-strong flex items-center justify-between gap-4 rounded-xl p-4"
        >
          <div>
            <p className="text-sm font-bold">공연의 감동을 더 오래, 더 가까이</p>
            <p className="mt-1 text-[11px] text-[var(--arena-muted)]">
              공연 전후, 아레나 주변의 다양한 즐길거리를 지금 바로 확인해보세요.
            </p>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
            style={{ background: accent, color: "#05060a" }}
          >
            →
          </span>
        </a>

        {chips.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="arena-glass flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-center"
          >
            <span className="text-lg">{c.icon}</span>
            <strong className="text-[11px]">{c.label}</strong>
            <span className="text-[9px] text-[var(--arena-muted)]">{c.sub}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
