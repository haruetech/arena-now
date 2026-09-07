const parentPrograms = [
  { time: "18:50", label: "체크인" },
  { time: "19:10", label: "어쩌다 어른형 토크" },
  { time: "20:10", label: "Tea Break" },
  { time: "20:30", label: "음악 프로그램" },
  { time: "21:20", label: "아레나 이동" },
];

const categories = ["강연", "AI 클래스", "명상", "음악", "소극장 공연", "건강", "문화체험", "식사"];

export default function ThreeHoursTeaser({ accent }: { accent: string }) {
  return (
    <section id="parents" className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="arena-glass rounded-lg p-8">
        <p className="mb-1 text-xs tracking-wide" style={{ color: accent }}>
          3 HOURS
        </p>
        <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
          아이가 공연을 보는 3시간,
          <br />
          부모에게도 새로운 공연이 시작됩니다
        </h2>
        <p className="mb-8 text-sm text-[var(--arena-muted)]">
          자녀 공연 19:00–21:30 기준 부모님 추천 코스
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: "var(--arena-border)", color: "var(--arena-text)" }}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {parentPrograms.map((p) => (
            <div key={p.time} className="arena-glass rounded-md px-4 py-3">
              <p className="text-xs tabular-nums" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
                {p.time}
              </p>
              <p className="mt-1 text-sm">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
