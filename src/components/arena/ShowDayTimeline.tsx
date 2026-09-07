const timeline = [
  { time: "15:30", label: "창동 도착" },
  { time: "16:00", label: "식사" },
  { time: "17:20", label: "카페" },
  { time: "18:00", label: "굿즈 · 짐보관" },
  { time: "19:00", label: "SHOW", highlight: true },
  { time: "21:30", label: "공연 종료" },
  { time: "21:45", label: "야식" },
  { time: "22:40", label: "귀가" },
];

export default function ShowDayTimeline({ accent }: { accent: string }) {
  return (
    <section id="show" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">
        MY SHOW DAY
      </p>
      <h2
        className="mb-8 text-2xl sm:text-3xl"
        style={{ fontFamily: "var(--arena-font-display)" }}
      >
        장소가 아니라, 하루를 설계합니다
      </h2>

      <div className="relative pl-6">
        <div
          className="absolute left-[7px] top-1 bottom-1 w-px"
          style={{ background: "var(--arena-border)" }}
          aria-hidden
        />
        <div className="flex flex-col gap-6">
          {timeline.map((t) => (
            <div key={t.time} className="relative flex items-baseline gap-4">
              <span
                className="absolute -left-6 h-3 w-3 -translate-x-1/2 rounded-full"
                style={{
                  background: t.highlight ? accent : "var(--arena-border)",
                  boxShadow: t.highlight ? `0 0 10px ${accent}` : "none",
                }}
                aria-hidden
              />
              <span
                className="w-14 shrink-0 text-sm tabular-nums"
                style={{ fontFamily: "var(--arena-font-display)", color: t.highlight ? accent : "var(--arena-muted)" }}
              >
                {t.time}
              </span>
              <span className={t.highlight ? "text-lg font-bold" : "text-sm text-[var(--arena-text)]"}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
