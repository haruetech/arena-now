import { Prediction } from "@/lib/arena/predict";

// 카드에 적힌 title/action 텍스트로 관련 섹션을 추정해 실제로 이동시킵니다.
// (완벽한 매칭은 아니므로, 실 데이터 연동 시 Prediction에 href 필드를 직접 추가하는 게 더 정확합니다.)
function predictionHref(p: Prediction): string {
  const key = `${p.title} ${p.action}`;
  if (/주차/.test(key)) return "#park";
  if (/식사|먹/.test(key)) return "#eat";
  if (/화장실/.test(key)) return "#toilet";
  if (/동행자|COMPANION/.test(key)) return "#companion";
  if (/MEET|귀가|택시|출차|집/.test(key)) return "#after";
  if (/혼잡|게이트|입구/.test(key)) return "#live-issues";
  if (/날씨|준비|체크/.test(key)) return "#alert";
  return "#show";
}

// NOW AI: 검색하게 하지 않고, 지금 상태 + 이동수단 기준으로 3가지만 먼저 제안합니다.
export default function PredictiveAI({ predictions, accent }: { predictions: Prediction[]; accent: string }) {
  return (
    <section id="now-ai" className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="arena-glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs tracking-wide" style={{ color: accent }}>
              ● NOW AI
            </p>
            <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
              찾게 하지 않고, 지금 필요한 3가지만
            </h2>
            <p className="mt-2 text-sm text-[var(--arena-muted)]">
              공연시간·이동수단·현장상황을 바탕으로 다음 행동을 먼저 제안합니다.
            </p>
          </div>
          <span className="self-start rounded-full border border-white/10 px-3 py-1 text-[9px] text-[var(--arena-muted)]">
            PREDICTIVE PREVIEW
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {predictions.map((p, idx) => (
            <a
              key={p.title}
              href={predictionHref(p)}
              className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                p.tone === "urgent" ? "border-rose-400/30 bg-rose-400/5" : "border-white/10 bg-white/[0.035]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold" style={{ color: accent, fontFamily: "var(--arena-font-display)" }}>
                  {p.icon}
                </span>
                <span className="text-[10px] text-[var(--arena-muted)]">0{idx + 1}</span>
              </div>
              <strong className="mt-6 block text-base">{p.title}</strong>
              <p className="mt-2 text-xs leading-6 text-[var(--arena-muted)]">{p.detail}</p>
              {p.reason && (
                <p className="mt-3 text-[10px] font-medium" style={{ color: accent }}>
                  왜? {p.reason}
                </p>
              )}
              <span className="mt-5 inline-block text-[10px]" style={{ color: accent }}>
                {p.action} →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-4 text-[10px] leading-5 text-[var(--arena-muted)]">
          * 지금은 규칙 기반 프로토타입입니다. 실제 운영에서는 공식 공연·주차·날씨·교통 데이터와 AI를 연결합니다.
        </p>
      </div>
    </section>
  );
}
