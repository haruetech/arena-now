const situations = [
  { tag: "NOW OPEN", desc: "지금 영업 중인 곳" },
  { tag: "60 MINUTES", desc: "공연 전 1시간 안에 가능" },
  { tag: "AFTER 10PM", desc: "밤 10시 이후에도 여는 곳" },
  { tag: "10 MIN WALK", desc: "걸어서 10분 거리" },
  { tag: "PARENTS PICK", desc: "부모님이 좋아할 만한 곳" },
];

// 네이버지도와의 차별점: 장소가 아니라 "관람객의 상황"으로 분류합니다.
export default function AroundChips({ accent }: { accent: string }) {
  return (
    <section id="around" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">AROUND ARENA</p>
      <h2 className="mb-8 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        지도가 아니라, 상황으로 찾습니다
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {situations.map((s) => (
          <div key={s.tag} className="arena-glass flex items-center justify-between rounded-md p-4">
            <div>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
                {s.tag}
              </p>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">{s.desc}</p>
            </div>
            <span className="text-xs text-[var(--arena-muted)]">준비 중</span>
          </div>
        ))}
      </div>
    </section>
  );
}
