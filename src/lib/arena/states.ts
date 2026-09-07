// ARENA NOW의 핵심 아이디어: "장소"가 아니라 "시간"에 따라 화면 전체가 바뀝니다.
// 상태마다 색(긴급도)·헤드라인·행동유도가 완전히 달라집니다.
// 실제 공연 일정이 붙기 전까지는 StateSwitcher로 직접 전환해보는 데모입니다.

export type ArenaStateKey =
  | "upcoming"
  | "tomorrow"
  | "liveDay"
  | "threeHours"
  | "doorsOpen"
  | "onStage"
  | "showEnded";

export interface ArenaState {
  key: ArenaStateKey;
  demoLabel: string; // 상태 전환 버튼에 쓰이는 짧은 이름
  badge: string; // 화면 상단 뱃지 ("D-12", "LIVE DAY" 등)
  headline: string;
  sub: string;
  accent: string; // 상태별 강조색 (긴급도를 색으로 표현)
  glow: string; // 배경 글로우 색
  cta: string;
  pulse?: boolean; // 긴급 상태는 뱃지가 깜빡임
}

export const arenaStates: ArenaState[] = [
  {
    key: "upcoming",
    demoLabel: "평소 (D-12)",
    badge: "NEXT SHOW · D-12",
    headline: "다음 공연까지 12일",
    sub: "미리 관심 등록하면 티켓 오픈과 동시에 알려드려요.",
    accent: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.25)",
    cta: "이 공연 관심 등록하기",
  },
  {
    key: "tomorrow",
    demoLabel: "공연 전날",
    badge: "TOMORROW",
    headline: "내일, 서울아레나에 가시나요?",
    sub: "가는 길·주차·좌석 정보를 미리 확인해보세요.",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.25)",
    cta: "MY SHOW DAY 미리 만들기",
  },
  {
    key: "liveDay",
    demoLabel: "공연 당일",
    badge: "🔴 LIVE DAY",
    headline: "오늘, 공연이 있는 날입니다",
    sub: "03:21:47 UNTIL SHOW · 지금 출발하면 17:42 도착 예정",
    accent: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.3)",
    cta: "MY SHOW DAY 시작하기",
    pulse: true,
  },
  {
    key: "threeHours",
    demoLabel: "공연 3시간 전",
    badge: "3 HOURS TO SHOW",
    headline: "공연 전 78분이 남았습니다",
    sub: "지금 할 수 있는 것: 식사 · 카페 · 짐보관 · 부모 프로그램",
    accent: "#fb923c",
    glow: "rgba(251, 146, 60, 0.28)",
    cta: "WHAT CAN I DO NOW? →",
  },
  {
    key: "doorsOpen",
    demoLabel: "입장 시작",
    badge: "DOORS OPEN",
    headline: "입장이 시작됐습니다",
    sub: "좌석 위치와 가장 가까운 입구를 안내해드려요.",
    accent: "#34d399",
    glow: "rgba(52, 211, 153, 0.28)",
    cta: "내 입구 확인하기",
    pulse: true,
  },
  {
    key: "onStage",
    demoLabel: "공연 중",
    badge: "ON STAGE",
    headline: "공연이 진행 중입니다",
    sub: "부모님은 지금 3 HOURS 프로그램을 즐기고 계실 시간이에요.",
    accent: "#c026d3",
    glow: "rgba(192, 38, 211, 0.28)",
    cta: "부모 프로그램 진행 상황 보기",
  },
  {
    key: "showEnded",
    demoLabel: "공연 종료 후",
    badge: "SHOW ENDED",
    headline: "오늘의 공연은 끝났지만,\n당신의 SHOW DAY는 아직 끝나지 않았습니다",
    sub: "막차까지 01:42 · 지금 갈 수 있는 식당과 귀가 정보를 안내해드려요.",
    accent: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.22)",
    cta: "귀가 정보 보기",
  },
];
