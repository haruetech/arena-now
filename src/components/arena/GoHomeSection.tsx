const homeCards = [
  { label: "막차", value: "01:42 남음" },
  { label: "택시 승차지점", value: "3번 게이트 앞" },
  { label: "주차장 출차", value: "안내 준비 중" },
  { label: "22시 이후 식당", value: "야식 옵션 안내" },
];

// GO HOME(구 AFTER SHOW): 공연 종료 후 최대 불편 지점.
// MEET POINT는 종료 30분 전부터 안내해 인파 속 일행 찾기 문제를 미리 해결합니다.
export default function GoHomeSection({ accent }: { accent: string }) {
  return (
    <section id="after" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">GO HOME</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        공연이 끝나도, SHOW DAY는 계속됩니다
      </h2>
      <p className="mb-6 text-xs text-[var(--arena-muted)]">
        * 아래 값은 예시(DEMO)이며, 실제 교통·매장 데이터 연동 전까지는 운영값이 아닙니다.
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {homeCards.map((item) => (
          <div key={item.label} className="arena-glass relative rounded-md p-4 text-center">
            <span className="absolute right-2 top-2 rounded-full border border-[var(--arena-border)] px-1.5 py-0.5 text-[9px] text-[var(--arena-muted)]">
              DEMO
            </span>
            <p className="text-xs text-[var(--arena-muted)]">{item.label}</p>
            <p className="mt-1 text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="arena-glass-strong rounded-md p-5">
        <p className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
          MEET POINT
        </p>
        <p className="mt-1 text-sm">종료 30분 전부터, 동행자와 만날 위치를 미리 지정할 수 있어요.</p>
        <p className="mt-1 text-xs text-[var(--arena-muted)]">인파 속에서 서로를 찾아 헤매지 않도록.</p>
      </div>
    </section>
  );
}
