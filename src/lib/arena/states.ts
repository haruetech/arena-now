// 11단계로 세분화한 상태머신 (기존 7단계보다 촘촘하게).
// 시간이 흐를수록 파랑(여유) → 노랑/주황(준비) → 빨강(긴급, 60분 전) →
// 초록(입장) → 보라(공연 중) → 회색(종료)으로 색 자체가 긴급도를 표현합니다.
export type ArenaStateKey =
  | "upcoming"
  | "tomorrow"
  | "fiveHours"
  | "fourHours"
  | "threeHours"
  | "twoHours"
  | "ninetyMinutes"
  | "sixtyMinutes"
  | "doorsOpen"
  | "onStage"
  | "showEnded";

export interface ArenaState {
  key: ArenaStateKey;
  demoLabel: string;
  badge: string;
  headline: string;
  sub: string;
  accent: string;
  glow: string;
  cta: string;
  pulse?: boolean;
}

export const arenaStates: ArenaState[] = [
  {
    key: "upcoming",
    demoLabel: "평소 (D-12)",
    badge: "NEXT SHOW · D-12",
    headline: "공연 전 불편을 미리 없애세요",
    sub: "주차·날씨·이동·짐보관을 미리 준비할수록 당일이 쉬워집니다.",
    accent: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.25)",
    cta: "미리 준비하기",
  },
  {
    key: "tomorrow",
    demoLabel: "공연 전날",
    badge: "TOMORROW",
    headline: "내일의 SHOW DAY를 30초 만에 준비하세요",
    sub: "날씨와 이동수단을 확인하고, 자가용이면 주차 후보부터 정해두세요.",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.25)",
    cta: "내일 준비 체크",
  },
  {
    key: "fiveHours",
    demoLabel: "5시간 전",
    badge: "5 HOURS TO SHOW",
    headline: "자가용이라면 지금 주차부터 확인할 시간입니다",
    sub: "공연장 60분 전 도착 기준으로 주차·출발·식사 동선을 먼저 정합니다.",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.28)",
    cta: "주차 후보 3곳 보기",
  },
  {
    key: "fourHours",
    demoLabel: "4시간 전",
    badge: "4 HOURS TO SHOW",
    headline: "주차와 식사 동선을 지금 확정하세요",
    sub: "검색하지 않아도 가장 현실적인 동선 3가지를 먼저 보여드립니다.",
    accent: "#fb923c",
    glow: "rgba(251, 146, 60, 0.28)",
    cta: "내 동선 만들기",
  },
  {
    key: "threeHours",
    demoLabel: "3시간 전",
    badge: "3 HOURS TO SHOW",
    headline: "도착 후 무엇을 할지 미리 정해두세요",
    sub: "주차가 미확정이면 지금 확인하고, 식사·짐보관·현장행사 순서를 제안합니다.",
    accent: "#fb923c",
    glow: "rgba(251, 146, 60, 0.3)",
    cta: "NOW AI 추천 보기",
  },
  {
    key: "twoHours",
    demoLabel: "2시간 전",
    badge: "2 HOURS TO SHOW",
    headline: "이제 공연장 쪽으로 이동할 시간입니다",
    sub: "빠른 식사와 바로 이동 중 어느 쪽이 안전한지 보여드립니다.",
    accent: "#fb7185",
    glow: "rgba(251, 113, 133, 0.28)",
    cta: "지금 해야 할 일 3개",
  },
  {
    key: "ninetyMinutes",
    demoLabel: "90분 전",
    badge: "90 MINUTES TO SHOW",
    headline: "공연장 주변에서 입장 준비를 시작하세요",
    sub: "화장실·짐보관·MD·내 입구를 가까운 순서로 확인하세요.",
    accent: "#f87171",
    glow: "rgba(248, 113, 113, 0.28)",
    cta: "현장 준비 보기",
  },
  {
    key: "sixtyMinutes",
    demoLabel: "60분 전",
    badge: "60 MINUTES TO SHOW",
    headline: "이제 먹거리보다 입장 준비가 우선입니다",
    sub: "화장실·게이트·굿즈·혼잡 정보를 빠르게 확인하세요.",
    accent: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.32)",
    cta: "내 입장 준비",
    pulse: true,
  },
  {
    key: "doorsOpen",
    demoLabel: "입장 시작",
    badge: "DOORS OPEN",
    headline: "입장이 시작됐습니다",
    sub: "내 좌석과 가장 가까운 입구, 화장실, 반입 유의사항을 확인하세요.",
    accent: "#34d399",
    glow: "rgba(52, 211, 153, 0.28)",
    cta: "내 입구 찾기",
    pulse: true,
  },
  {
    key: "onStage",
    demoLabel: "공연 중",
    badge: "ON STAGE",
    headline: "공연은 진행 중, 동행자의 시간은 계속됩니다",
    sub: "COMPANION TIME과 종료 전 MEET POINT 준비를 한 화면에서 확인하세요.",
    accent: "#c026d3",
    glow: "rgba(192, 38, 211, 0.28)",
    cta: "동행자 시간 보기",
  },
  {
    key: "showEnded",
    demoLabel: "공연 종료 후",
    badge: "SHOW ENDED",
    headline: "지금 가장 편하게 빠져나가는 방법을 먼저 보여드립니다",
    sub: "출차·대중교통·택시·만남·늦게 여는 식당을 상황별로 정리합니다.",
    accent: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.22)",
    cta: "GO HOME 보기",
  },
];
