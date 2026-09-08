"use client";

import WeatherWidget from "./WeatherWidget";

/**
 * Desktop one-view dashboard.
 *
 * The visual reference is an AI-generated ARENA NOW concept image.  The image
 * is intentionally treated as a composition layer, while the transparent
 * anchors below are real web controls.  This keeps the desktop landing screen
 * visually identical to the approved concept while preserving navigation and
 * accessibility.
 */
const hotspots = [
  // header
  { label: "공연정보", href: "#show", left: 23.5, top: 1.2, width: 7.5, height: 5.2 },
  { label: "가는길", href: "#transport", left: 31.0, top: 1.2, width: 6.0, height: 5.2 },
  { label: "주변맛집", href: "#eat", left: 37.2, top: 1.2, width: 7.0, height: 5.2 },
  { label: "현장서비스", href: "#painpoints", left: 44.2, top: 1.2, width: 8.0, height: 5.2 },
  { label: "AI 추천", href: "#now-ai", left: 52.0, top: 1.2, width: 6.5, height: 5.2 },
  { label: "MY EVENT", href: "#my-event", left: 58.5, top: 1.2, width: 8.0, height: 5.2 },
  { label: "LIVE NOW", href: "#live-issues", left: 73.8, top: 0.8, width: 7.2, height: 5.7 },

  // hero + pins
  { label: "지금 공연 정보 보기", href: "#show", left: 2.6, top: 36.1, width: 17.0, height: 6.7 },
  { label: "주차장", href: "#park", left: 33.7, top: 14.2, width: 10.5, height: 10.5 },
  { label: "푸드존", href: "#eat", left: 58.1, top: 14.5, width: 10.5, height: 10.5 },
  { label: "창동역", href: "#transport", left: 23.4, top: 30.8, width: 10.5, height: 10.5 },
  { label: "입장게이트", href: "#painpoints", left: 67.5, top: 25.2, width: 11.0, height: 10.5 },
  { label: "화장실", href: "#toilet", left: 67.0, top: 37.7, width: 11.5, height: 10.0 },
  { label: "공연 상세보기", href: "#show", left: 80.6, top: 33.6, width: 15.0, height: 5.8 },

  // six shortcuts
  { label: "가는길 바로가기", href: "#transport", left: 2.5, top: 51.7, width: 15.0, height: 8.4 },
  { label: "주변맛집 바로가기", href: "#eat", left: 17.8, top: 51.7, width: 15.0, height: 8.4 },
  { label: "현장서비스 바로가기", href: "#painpoints", left: 33.2, top: 51.7, width: 15.0, height: 8.4 },
  { label: "AI 추천 바로가기", href: "#now-ai", left: 48.7, top: 51.7, width: 15.0, height: 8.4 },
  { label: "LIVE NOW 바로가기", href: "#live-issues", left: 64.0, top: 51.7, width: 15.0, height: 8.4 },
  { label: "MY EVENT 바로가기", href: "#my-event", left: 79.4, top: 51.7, width: 18.0, height: 8.4 },

  // cards + chips
  { label: "TODAY SHOW 상세", href: "#show", left: 2.5, top: 61.0, width: 30.0, height: 20.7 },
  { label: "LIVE NOW 상세", href: "#live-issues", left: 33.0, top: 61.0, width: 30.5, height: 20.7 },
  { label: "AI 추천 전체보기", href: "#now-ai", left: 64.0, top: 61.0, width: 33.0, height: 20.7 },
  { label: "주차 정보", href: "#park", left: 66.8, top: 77.1, width: 7.2, height: 3.8 },
  { label: "맛집 추천", href: "#eat", left: 74.1, top: 77.1, width: 7.2, height: 3.8 },
  { label: "짐보관", href: "#painpoints", left: 81.5, top: 77.1, width: 6.8, height: 3.8 },
  { label: "귀가 교통", href: "#after", left: 88.5, top: 77.1, width: 7.5, height: 3.8 },

  // lower service strip
  { label: "공연의 감동 더 오래", href: "#around", left: 2.5, top: 83.1, width: 45.5, height: 8.5 },
  { label: "맛집·카페", href: "#eat", left: 48.4, top: 83.1, width: 10.0, height: 8.5 },
  { label: "짐보관 서비스", href: "#painpoints", left: 58.9, top: 83.1, width: 10.0, height: 8.5 },
  { label: "귀가 교통", href: "#after", left: 69.4, top: 83.1, width: 10.0, height: 8.5 },
  { label: "이벤트·기념품", href: "#voice", left: 80.0, top: 83.1, width: 16.7, height: 8.5 },
];

export default function DesktopDashboard() {
  return (
    <section id="desktop-dashboard" className="relative hidden w-full overflow-hidden bg-[#020916] lg:block" aria-label="ARENA NOW 메인 대시보드">
      <div className="relative mx-auto h-[min(calc(100vh-8px),960px)] min-h-[780px] max-w-[1920px] overflow-hidden bg-[#020916]">
        <img
          src="/arena-dashboard-reference.png"
          alt="ARENA NOW 공연 당일 통합 대시보드 컨셉"
          className="absolute inset-0 h-full w-full object-cover object-top"
          draggable={false}
        />

        {/* 배경 시안의 데모 날씨를 실제 기상청 관측 위젯으로 덮어 표시합니다. */}
        <div className="absolute right-[2.2%] top-[1.1%] z-30">
          <WeatherWidget desktop />
        </div>

        {/* Real web controls positioned over the approved one-view composition. */}
        <nav aria-label="메인 대시보드 바로가기" className="absolute inset-0 z-10">
          {hotspots.map((item) => (
            <a
              key={`${item.label}-${item.href}-${item.left}`}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className="absolute rounded-2xl outline-none transition hover:bg-white/[.035] focus-visible:bg-cyan-300/10 focus-visible:ring-2 focus-visible:ring-cyan-300/80"
              style={{ left: `${item.left}%`, top: `${item.top}%`, width: `${item.width}%`, height: `${item.height}%` }}
            />
          ))}
        </nav>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-20 bg-gradient-to-t from-[#020916] to-transparent" />
      </div>
      <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 border-y border-cyan-300/10 bg-[#06111e] px-6 py-3 text-[11px] text-white/55">
        <span>AI-generated concept visual · 실제 시설·배치·공연 정보와 다를 수 있습니다.</span>
        <a href="#service-detail" className="relative z-20 font-bold text-cyan-300 hover:text-white">상세 서비스 보기 ↓</a>
      </div>
    </section>
  );
}
