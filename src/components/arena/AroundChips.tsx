const situations = [
  { tag: "NOW OPEN", desc: "지금 실제로 이용 가능한 곳만" },
  { tag: "120 MIN", desc: "공연 전 여유 있게 식사 가능한 곳" },
  { tag: "90 MIN", desc: "빠르게 먹고 이동 가능한 곳" },
  { tag: "10 MIN WALK", desc: "공연장 도보 10분 안쪽" },
  { tag: "AFTER 10PM", desc: "공연 종료 후에도 이용 가능한 곳" },
  { tag: "ACCESSIBLE", desc: "이동·접근성이 확인된 곳" },
];

// AROUND: 장소 목록이 아니라 "지금 가능한 선택"으로 분류합니다.
// 접근성(ACCESSIBLE)도 포함해 휠체어·엘리베이터가 필요한 관객도 놓치지 않습니다.
export default function AroundChips({ accent }: { accent: string }) {
  return (
    <section id="around" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">AROUND · SITUATION FIRST</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        지도가 아니라, 지금 가능한 선택으로
      </h2>
      <p className="mb-6 text-sm text-[var(--arena-muted)]">
        수십 개 목록 대신, 공연시간에 맞는 후보를 최대 3개부터 보여주는 것이 원칙입니다.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {situations.map((s) => (
          <div key={s.tag} className="arena-glass rounded-md p-4">
            <p className="text-xs font-bold" style={{ color: accent }}>
              {s.tag}
            </p>
            <p className="mt-2 text-sm">{s.desc}</p>
            <p className="mt-1 text-[10px] text-[var(--arena-muted)]">데이터 연결 준비 중</p>
          </div>
        ))}
      </div>
    </section>
  );
}
