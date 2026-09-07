const painPoints = [
  { tag: "PARK", when: "4~5시간 전부터", desc: "주차는 공연 직전이 아니라 미리" },
  { tag: "TOILET", when: "90~60분 전", desc: "위치·접근성·혼잡 수준" },
  { tag: "ENTER", when: "60분 전", desc: "게이트·좌석·입장 체크" },
  { tag: "BAG", when: "입장 전", desc: "짐보관 위치·운영시간" },
  { tag: "WEATHER", when: "D-1부터", desc: "비·폭염·한파 준비" },
  { tag: "GO HOME", when: "종료 전부터", desc: "출차·막차·택시·만남" },
];

// 한눈에 보는 요약. 아래 섹션들(PARK/TOILET/EAT/COMPANION/GO HOME)의 목차 역할.
export default function FrictionZeroSection({ accent }: { accent: string }) {
  return (
    <section id="painpoints" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">FRICTION ZERO</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        다른 곳이 놓치는 불편을 없애는 것이 목적입니다
      </h2>
      <p className="mb-6 text-sm text-[var(--arena-muted)]">
        주차·화장실·입장·짐·날씨·귀가·만남을 공연시간 순서대로 해결합니다.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {painPoints.map((p) => (
          <div key={p.tag} className="arena-glass rounded-md p-4">
            <p className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
              {p.tag}
            </p>
            <p className="mt-3 text-sm font-bold">{p.when}</p>
            <p className="mt-1 text-xs text-[var(--arena-muted)]">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
