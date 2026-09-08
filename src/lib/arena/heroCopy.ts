"use client";

export interface HeroCopy {
  navShow: string;
  navRoute: string;
  navFood: string;
  navService: string;
  navAi: string;
  navMy: string;
  liveLabel: string;
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSub: string;
  heroCta: string;
  footerTagline: string;
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
  navAi: "AI 추천",
  navMy: "MY EVENT",
  liveLabel: "LIVE NOW",
  heroEyebrow: "MUSIC BRINGS US TOGETHER",
  heroTitle1: "공연이 있는 날,",
  heroTitle2: "더 특별한 하루",
  heroSub: "공연부터 먹거리, 주차, 교통, 현장서비스까지\nARENA NOW가 함께합니다.",
  heroCta: "지금 공연 정보 보기",
  footerTagline: "Your Stage, Our Day",
  pinShowLabel: "SHOW",
  pinShowDesc: "오늘 공연 정보",
  pinParkLabel: "PARK",
  pinParkDesc: "주차 위치·요금",
  pinEatLabel: "EAT",
  pinEatDesc: "공연 전 식사·팝업",
  pinToiletLabel: "TOILET",
  pinToiletDesc: "가까운 화장실",
  pinCompanionLabel: "COMPANION",
  pinCompanionDesc: "동행자의 시간",
  pinHomeLabel: "HOME",
  pinHomeDesc: "귀가·만남 장소",
};

const KEY = "arena-hero-copy-v2";

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
