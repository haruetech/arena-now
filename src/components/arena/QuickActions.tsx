import { ArenaStateKey } from "@/lib/arena/states";

interface QuickAction {
  icon: string;
  label: string;
  sub: string;
  href: string;
}

const byState: Partial<Record<ArenaStateKey, QuickAction[]>> = {
  fiveHours: [
    { icon: "🚗", label: "주차하기", sub: "4~5시간 전부터", href: "#park" },
    { icon: "🍔", label: "먹고 가기", sub: "주차와 동선 연결", href: "#eat" },
    { icon: "🎒", label: "짐 맡기기", sub: "입장 전 가볍게", href: "#painpoints" },
    { icon: "☂️", label: "오늘 날씨", sub: "대기 준비까지", href: "#alert" },
  ],
  fourHours: [
    { icon: "🚗", label: "주차하기", sub: "후보 3곳", href: "#park" },
    { icon: "🍔", label: "먹고 가기", sub: "시간 맞는 곳만", href: "#eat" },
    { icon: "🎒", label: "짐 맡기기", sub: "보관 위치", href: "#painpoints" },
    { icon: "🎪", label: "오늘 현장", sub: "팝업·MD·행사", href: "#live-issues" },
  ],
  threeHours: [
    { icon: "🚗", label: "주차 확인", sub: "미확정이면 지금", href: "#park" },
    { icon: "🍔", label: "먹고 가기", sub: "90~120분 기준", href: "#eat" },
    { icon: "🎒", label: "짐 맡기기", sub: "보관 위치", href: "#painpoints" },
    { icon: "🎪", label: "오늘 현장", sub: "실시간 이슈", href: "#live-issues" },
  ],
  twoHours: [
    { icon: "🚶", label: "공연장 이동", sub: "이제 이동 우선", href: "#show" },
    { icon: "🚻", label: "화장실", sub: "도착 후 먼저", href: "#toilet" },
    { icon: "🎒", label: "짐 맡기기", sub: "입장 전", href: "#painpoints" },
    { icon: "🎪", label: "현장 행사", sub: "가까운 곳만", href: "#around" },
  ],
  ninetyMinutes: [
    { icon: "🚻", label: "화장실", sub: "가까운 3곳", href: "#toilet" },
    { icon: "🚪", label: "내 입구", sub: "게이트 확인", href: "#live-issues" },
    { icon: "🎒", label: "짐 맡기기", sub: "마지막 체크", href: "#painpoints" },
    { icon: "🛍️", label: "굿즈·팝업", sub: "현장 정보", href: "#around" },
  ],
  sixtyMinutes: [
    { icon: "🚻", label: "화장실", sub: "지금 확인", href: "#toilet" },
    { icon: "🚪", label: "내 입구", sub: "좌석구역 기준", href: "#live-issues" },
    { icon: "📊", label: "혼잡 보기", sub: "여유·보통·혼잡", href: "#live-issues" },
    { icon: "✅", label: "입장 체크", sub: "반입 유의", href: "#show" },
  ],
  doorsOpen: [
    { icon: "🚪", label: "내 입구", sub: "바로 찾기", href: "#live-issues" },
    { icon: "🚻", label: "화장실", sub: "입장 전", href: "#toilet" },
    { icon: "📊", label: "혼잡 보기", sub: "최근 확인", href: "#live-issues" },
    { icon: "✅", label: "좌석·입장", sub: "빠른 체크", href: "#show" },
  ],
  onStage: [
    { icon: "🎭", label: "동행자의 시간", sub: "90~180분", href: "#companion" },
    { icon: "📍", label: "만날 곳", sub: "MEET POINT", href: "#after" },
    { icon: "☕", label: "주변에서 쉬기", sub: "현재 영업", href: "#around" },
    { icon: "🚕", label: "귀가 준비", sub: "종료 전 미리", href: "#after" },
  ],
  showEnded: [
    { icon: "🚕", label: "집에 가기", sub: "방법 비교", href: "#after" },
    { icon: "🚗", label: "차 빼기", sub: "출차 안내", href: "#after" },
    { icon: "🚖", label: "택시 타기", sub: "승차지점", href: "#after" },
    { icon: "📍", label: "일행 만나기", sub: "MEET POINT", href: "#after" },
  ],
};

const fallback: QuickAction[] = [
  { icon: "☂️", label: "내일 준비", sub: "날씨·교통", href: "#alert" },
  { icon: "🚗", label: "주차 미리보기", sub: "자가용이면 먼저", href: "#park" },
  { icon: "🎫", label: "준비물", sub: "티켓·배터리", href: "#painpoints" },
  { icon: "🔔", label: "알림 받기", sub: "필요할 때 먼저", href: "#alert" },
];

// 상태가 바뀌면 바로가기 4개도 같이 바뀝니다. 각 버튼은 실제 섹션으로 즉시 이동합니다.
export default function QuickActions({ state, accent }: { state: ArenaStateKey; accent: string }) {
  const actions = byState[state] ?? fallback;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="지금 필요한 기능">
      {actions.map((a) => (
        <a
          href={a.href}
          key={a.label}
          className="arena-glass flex min-h-[90px] flex-col rounded-xl p-3 text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <span className="text-base" style={{ color: accent }}>
            {a.icon}
          </span>
          <strong className="mt-auto text-sm">{a.label}</strong>
          <span className="mt-0.5 text-[10px] text-[var(--arena-muted)]">{a.sub}</span>
        </a>
      ))}
    </div>
  );
}
