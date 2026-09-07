const toilets = [
  { name: "1층 로비 화장실", type: "일반", distance: "30m", status: "혼잡" },
  { name: "2층 동측 화장실", type: "일반·장애인", distance: "80m", status: "여유" },
  { name: "지하 1층 화장실", type: "일반", distance: "120m", status: "보통" },
];

const statusColor: Record<string, string> = {
  여유: "#34d399",
  보통: "#fbbf24",
  혼잡: "#f43f5e",
};

// TOILET NOW: 위치보다 "지금 덜 붐비는 곳"을 알려주는 게 핵심.
// 최근 확인시각을 표시해 근거 없는 숫자를 만들지 않습니다(제보 결합 전제).
export default function ToiletNowSection({ accent }: { accent: string }) {
  return (
    <section id="toilet" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">TOILET NOW</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        가장 안 붐비는 화장실을 먼저
      </h2>
      <p className="mb-6 text-xs text-[var(--arena-muted)]">
        * 혼잡도는 예시(DEMO)이며, 실 서비스에서는 최근 확인시각과 함께 표시됩니다.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {toilets.map((t) => (
          <div key={t.name} className="arena-glass rounded-md p-4">
            <div className="mb-2 flex items-center justify-between">
              <span
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{ background: `${statusColor[t.status]}22`, color: statusColor[t.status] }}
              >
                {t.status}
              </span>
              <span className="text-[10px] text-[var(--arena-muted)]">2분 전 확인</span>
            </div>
            <p className="text-sm font-bold">{t.name}</p>
            <p className="mt-1 text-xs text-[var(--arena-muted)]">
              {t.type} · {t.distance}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
