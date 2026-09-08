"use client";

// 상단 네비게이션 라벨, 핫스팟 라벨/설명 등 "상태와 무관하게 고정된" 텍스트만
// 편집 대상으로 삼습니다. 시간대별로 자동 바뀌는 헤드라인·배지(states.ts)는
// 상태머신의 핵심이라 이 편집 대상에 포함하지 않습니다.

export interface HeroCopy {
  navShow: string;
  navRoute: string;
  navFood: string;
  navService: string;
  navAi: string;
  navMy: string;
  liveLabel: string;
  pinShowLabel: string;
  pinShowDesc: string;
  pinParkLabel: string;
  pinParkDesc: string;
  pinEatLabel: string;
  pinEatDesc: string;
  pinToiletLabel: string;
  pinToiletDesc: string;
  pinCompanionLabel: string;
  pinCompanionDesc: string;
  pinHomeLabel: string;
  pinHomeDesc: string;
}

export const DEFAULT_HERO_COPY: HeroCopy = {
  navShow: "공연정보",
  navRoute: "가는길",
  navFood: "주변맛집",
  navService: "현장서비스",
  navAi: "AI추천",
  navMy: "MY EVENT",
  liveLabel: "LIVE NOW",
  pinShowLabel: "SHOW",
  pinShowDesc: "오늘 공연 정보",
  pinParkLabel: "PARK",
  pinParkDesc: "주차 위치·요금",
  pinEatLabel: "EAT",
  pinEatDesc: "공연 전 식사·팝업",
  pinToiletLabel: "TOILET",
  pinToiletDesc: "안 붐비는 화장실",
  pinCompanionLabel: "COMPANION",
  pinCompanionDesc: "동행자의 시간",
  pinHomeLabel: "HOME",
  pinHomeDesc: "귀가·만남 장소",
};

const KEY = "arena-hero-copy-v1";

export function loadHeroCopy(): HeroCopy {
  if (typeof window === "undefined") return DEFAULT_HERO_COPY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_HERO_COPY;
    return { ...DEFAULT_HERO_COPY, ...JSON.parse(raw) } as HeroCopy;
  } catch {
    return DEFAULT_HERO_COPY;
  }
}

export function saveHeroCopy(copy: HeroCopy) {
  window.localStorage.setItem(KEY, JSON.stringify(copy));
}

export function resetHeroCopy() {
  window.localStorage.removeItem(KEY);
}
