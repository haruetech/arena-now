import { ArenaStateKey } from "./states";

/**
 * NOW AI — 지금 상태 + 이동수단을 함께 보고 "다음에 뭘 하면 좋을지" 3가지로
 * 압축해 보여줍니다. 자가용이면 주차가, 대중교통이면 도착시간이, 택시면
 * 승하차 지점이 먼저 나오는 식으로 이동수단에 따라 우선순위가 달라집니다.
 * 지금은 규칙 기반 프로토타입이며, 실제로는 공연·주차·날씨·교통 데이터와
 * 연결해야 합니다.
 */

export type TransportMode = "car" | "transit" | "taxi";

export interface Prediction {
  icon: string;
  title: string;
  detail: string;
  action: string;
  reason?: string;
  tone: "urgent" | "ready" | "calm";
}

const earlyByTransport: Record<TransportMode, Prediction[]> = {
  car: [
    { icon: "🚗", title: "주차를 가장 먼저", detail: "공연 4~5시간 전부터 주차 후보 3곳을 정하고 출발 동선을 준비합니다.", action: "주차 후보 3곳", tone: "urgent" },
    { icon: "🍔", title: "식사 동선 같이 보기", detail: "주차 위치에서 공연장까지 식사·도보 동선을 한 번에 봅니다.", action: "동선 3안", tone: "ready" },
    { icon: "☂️", title: "날씨·대기 준비", detail: "공연 당일 날씨에 따라 우산·복장·대기 장소를 미리 알려드립니다.", action: "오늘 준비", tone: "calm" },
  ],
  transit: [
    { icon: "🚇", title: "도착 시간을 먼저", detail: "공연장 60분 전 도착 기준으로 이동 준비를 시작합니다.", action: "교통 확인", tone: "urgent" },
    { icon: "🍔", title: "공연 전 식사", detail: "120분·90분 전에 가능한 식사만 우선 추천합니다.", action: "식사 3곳", tone: "ready" },
    { icon: "☂️", title: "날씨 준비", detail: "비·폭염·한파에 맞는 이동·대기 준비를 알려드립니다.", action: "오늘 준비", tone: "calm" },
  ],
  taxi: [
    { icon: "🚕", title: "승하차 지점을 미리", detail: "공연장 앞 혼잡을 피할 수 있는 승하차 지점을 준비합니다.", action: "승하차 보기", tone: "urgent" },
    { icon: "🍔", title: "공연 전 식사", detail: "시간이 충분한 식사 후보만 3개로 압축합니다.", action: "식사 3곳", tone: "ready" },
    { icon: "☂️", title: "날씨 준비", detail: "대기 상황에 맞춰 우산·복장 알림을 준비합니다.", action: "오늘 준비", tone: "calm" },
  ],
};

const byState: Partial<Record<ArenaStateKey, Prediction[]>> = {
  tomorrow: [
    { icon: "☂️", title: "날씨부터 확인", detail: "비·폭염·한파에 따라 대기와 이동 준비가 달라집니다.", action: "날씨 준비", tone: "calm" },
    { icon: "🎒", title: "짐·준비물 체크", detail: "모바일 티켓·보조배터리·반입 유의사항을 미리 확인하세요.", action: "체크리스트", tone: "ready" },
  ],
  twoHours: [
    { icon: "🚶", title: "공연장으로 이동", detail: "지금은 긴 식사보다 이동을 우선하는 편이 안전합니다.", action: "이동 시작", tone: "urgent" },
    { icon: "🚻", title: "도착 후 화장실", detail: "가까운 화장실 위치를 미리 확인해두세요.", action: "TOILET NOW", tone: "ready" },
    { icon: "🎒", title: "짐보관", detail: "입장 전 짐 보관 가능 장소를 확인합니다.", action: "BAG", tone: "calm" },
  ],
  ninetyMinutes: [
    { icon: "🚻", title: "화장실을 먼저 확인", detail: "가까운 화장실과 접근성 정보를 빠르게 확인합니다.", action: "TOILET NOW", tone: "urgent" },
    { icon: "🎒", title: "짐 맡길 곳 확인", detail: "캐리어·쇼핑백·굿즈 보관 위치를 확인하세요.", action: "BAG", tone: "ready" },
    { icon: "🚪", title: "내 입구 찾기", detail: "좌석 구역에 가까운 입구를 먼저 확인합니다.", action: "ENTER", tone: "ready" },
  ],
  sixtyMinutes: [
    { icon: "🚻", title: "화장실", detail: "식사보다 입장 준비가 우선입니다.", action: "가까운 화장실", tone: "urgent" },
    { icon: "🚪", title: "내 입구", detail: "게이트와 좌석 구역을 확인하세요.", action: "ENTER", tone: "urgent" },
    { icon: "📊", title: "현장 혼잡", detail: "실시간 연동 전에는 여유·보통·혼잡 수준만 표시합니다.", action: "혼잡 보기", tone: "ready" },
  ],
  onStage: [
    { icon: "🎭", title: "COMPANION TIME", detail: "공연을 보지 않는 동행자에게 90~180분 코스를 추천합니다.", action: "동행자 코스", tone: "calm" },
    { icon: "📍", title: "MEET POINT 준비", detail: "공연 종료 전에 만날 장소를 미리 정해두세요.", action: "만남 장소", tone: "ready" },
  ],
  showEnded: [
    { icon: "🚕", title: "GO HOME", detail: "대중교통·택시·출차 중 지금 가장 현실적인 방법을 비교합니다.", action: "귀가 방법", tone: "urgent" },
    { icon: "📍", title: "MEET POINT", detail: "인파 속에서 헤매지 않도록 지정 만남 장소를 공유합니다.", action: "일행 만나기", tone: "ready" },
    { icon: "🍜", title: "지금 먹을 곳", detail: "공연 종료 시각에도 영업 중인 곳만 추립니다.", action: "AFTER EAT", tone: "calm" },
  ],
};

const earlyStates: ArenaStateKey[] = ["upcoming", "tomorrow", "fiveHours", "fourHours", "threeHours"];

export function getPredictions(state: ArenaStateKey, transport: TransportMode): Prediction[] {
  let list: Prediction[];
  if (earlyStates.includes(state) && state !== "tomorrow") list = earlyByTransport[transport];
  else if (state === "doorsOpen") list = byState.sixtyMinutes!;
  else list = byState[state] ?? byState.sixtyMinutes!;

  const transportLabel = transport === "car" ? "자가용" : transport === "transit" ? "대중교통" : "택시";
  const stateReason: Partial<Record<ArenaStateKey, string>> = {
    fiveHours: "공연 5시간 전", fourHours: "공연 4시간 전", threeHours: "공연 3시간 전",
    twoHours: "공연 2시간 전", ninetyMinutes: "공연 90분 전", sixtyMinutes: "공연 60분 전",
    doorsOpen: "입장 시작", onStage: "공연 중", showEnded: "공연 종료 후",
  };
  return list.slice(0, 3).map((item) => ({
    ...item,
    reason: `${transportLabel} · ${stateReason[state] ?? "현재 공연 상황"} 기준 추천`,
  }));
}
