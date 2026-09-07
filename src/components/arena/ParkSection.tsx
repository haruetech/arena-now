const parkingOptions = [
  { name: "아레나 지하주차장", walk: "도보 3분", fee: "시간당 3,000원", status: "여유" },
  { name: "창동역 공영주차장", walk: "도보 8분", fee: "시간당 2,000원", status: "보통" },
  { name: "인근 민영주차장 A", walk: "도보 12분", fee: "1일 10,000원", status: "여유" },
];

const statusColor: Record<string, string> = {
  여유: "#34d399",
  보통: "#fbbf24",
  혼잡: "#f43f5e",
};

// 데이터 구현 원칙: 실시간 잔여면이 아니라 확인 가능한 정보(요금·거리·운영시간)부터.
// 상태(여유/보통/혼잡)는 실제 연동 전에는 DEMO 예시입니다.
export default function ParkSection({ accent }: { accent: string }) {
  return (
    <section id="park" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">PARK</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        주차 위치·요금·혼잡을 한 번에
      </h2>
      <p className="mb-6 text-xs text-[var(--arena-muted)]">
        * 혼잡도는 실 데이터 연동 전 예시(DEMO)입니다.
      </p>
      <div className="flex flex-col gap-3">
        {parkingOptions.map((p) => (
          <div key={p.name} className="arena-glass flex items-center justify-between rounded-md p-4">
            <div>
              <p className="text-sm font-bold">{p.name}</p>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">
                {p.walk} · {p.fee}
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs"
              style={{ background: `${statusColor[p.status]}22`, color: statusColor[p.status] }}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
