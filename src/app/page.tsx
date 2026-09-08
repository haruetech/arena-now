"use client";

import { useEffect, useMemo, useState } from "react";
import { arenaStates, ArenaStateKey } from "@/lib/arena/states";
import { computeArenaState, getExampleSchedule } from "@/lib/arena/schedule";
import { alertMoments, getAlertIndex } from "@/lib/arena/alerts";
import { getPredictions, TransportMode } from "@/lib/arena/predict";
import { LiveIssue, seedLiveIssues } from "@/lib/arena/liveIssues";
import ModeSwitcher, { ArenaMode } from "@/components/arena/ModeSwitcher";
import TransportSelector from "@/components/arena/TransportSelector";
import QuickActions from "@/components/arena/QuickActions";
import PredictiveAI from "@/components/arena/PredictiveAI";
import SmartAlertFeed from "@/components/arena/SmartAlertFeed";
import LiveNowWidget from "@/components/arena/LiveNowWidget";
import TodayShowCard from "@/components/arena/TodayShowCard";
import LiveIssueBoard from "@/components/arena/LiveIssueBoard";
import FrictionZeroSection from "@/components/arena/FrictionZeroSection";
import ShowDayTimeline from "@/components/arena/ShowDayTimeline";
import ParkSection from "@/components/arena/ParkSection";
import EatArenaZoneSection from "@/components/arena/EatArenaZoneSection";
import ToiletNowSection from "@/components/arena/ToiletNowSection";
import AroundChips from "@/components/arena/AroundChips";
import CompanionTimeSection from "@/components/arena/CompanionTimeSection";
import GoHomeSection from "@/components/arena/GoHomeSection";
import VoiceBoard from "@/components/arena/VoiceBoard";
import CopyEditor from "@/components/arena/CopyEditor";
import WeatherWidget from "@/components/arena/WeatherWidget";
import AiRecommendCard from "@/components/arena/AiRecommendCard";
import PromoBanner from "@/components/arena/PromoBanner";
import SiteFooter from "@/components/arena/SiteFooter";
import FloatingNavigator from "@/components/arena/FloatingNavigator";
import PremiumHero from "@/components/arena/PremiumHero";
import DesktopDashboard from "@/components/arena/DesktopDashboard";
import { DEFAULT_HERO_COPY, HeroCopy } from "@/lib/arena/heroCopy";

const SHOWDAY_URL = "https://showday.kr";

export default function ArenaNowPage() {
  const [mode, setMode] = useState<ArenaMode>("demo");
  const [demoKey, setDemoKey] = useState<ArenaStateKey>("fiveHours");
  const [transport, setTransport] = useState<TransportMode | null>(null);
  const [autoResult, setAutoResult] = useState(() => computeArenaState(new Date(), getExampleSchedule(new Date())));
  const [issues, setIssues] = useState<LiveIssue[]>(() => seedLiveIssues(Date.now()));
  const [nowOpen, setNowOpen] = useState(false);
  const [heroCopy, setHeroCopy] = useState<HeroCopy>(DEFAULT_HERO_COPY);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("arena-transport") as TransportMode | null;
    if (saved === "car" || saved === "transit" || saved === "taxi") setTransport(saved);
  }, []);
  useEffect(() => {
    if (transport) window.localStorage.setItem("arena-transport", transport);
  }, [transport]);
  useEffect(() => {
    if (mode !== "auto") return;
    const tick = () => setAutoResult(computeArenaState(new Date(), getExampleSchedule(new Date())));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [mode]);

  const stateKey = mode === "auto" ? autoResult.key : demoKey;
  const current = arenaStates.find((s) => s.key === stateKey)!;
  const currentAlert = alertMoments[getAlertIndex(stateKey)];
  const badge = mode === "auto" && stateKey === "upcoming" ? `NEXT SHOW · D-${autoResult.daysUntil}` : current.badge;
  const predictions = useMemo(() => transport ? getPredictions(stateKey, transport) : [], [stateKey, transport]);
  const showStart = getExampleSchedule(new Date()).start;

  return (
    <main id="top" className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 60% 32% at 50% 0%, ${current.glow}, transparent 72%), #040914` }} />

      <DesktopDashboard />

      <header className="sticky top-0 z-[80] border-b border-white/8 bg-[#06111e]/88 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <a href="#top" className="mr-auto min-w-0">
            <div className="text-lg font-black tracking-[.05em] text-white sm:text-2xl" style={{ fontFamily: "var(--arena-font-display)" }}>
              ARENA <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">NOW</span>
            </div>
            <div className="mt-0.5 hidden text-[8px] tracking-[.28em] text-white/45 sm:block">CHANGDONG SEOUL ARENA</div>
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-bold text-white/72 lg:flex" aria-label="주 메뉴">
            <a href="#show" className="hover:text-white">{heroCopy.navShow}</a>
            <a href="#transport" className="hover:text-white">{heroCopy.navRoute}</a>
            <a href="#eat" className="hover:text-white">{heroCopy.navFood}</a>
            <a href="#painpoints" className="hover:text-white">{heroCopy.navService}</a>
            <a href="#now-ai" className="hover:text-white">{heroCopy.navAi}</a>
            <a href="#my-event" className="hover:text-white">{heroCopy.navMy}</a>
          </nav>

          <a href="#show" aria-label="검색" className="hidden h-9 w-9 items-center justify-center rounded-full text-lg text-white/75 hover:bg-white/5 md:flex">⌕</a>
          <a href="#my-event" aria-label="MY EVENT" className="hidden h-9 w-9 items-center justify-center rounded-full text-lg text-white/75 hover:bg-white/5 md:flex">♙</a>
          <button onClick={() => document.getElementById("live-issues")?.scrollIntoView({ behavior: "smooth" })} className="hidden items-center gap-2 rounded-full border border-white/15 bg-[#07182a] px-3 py-2 text-[11px] font-black text-white hover:border-cyan-300/35 sm:flex">
            <span className="arena-pulse h-2 w-2 rounded-full bg-rose-500" /> {heroCopy.liveLabel}
          </button>
          <div className="hidden md:block"><WeatherWidget /></div>
          <button onClick={() => setMobileMenuOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/80 lg:hidden" aria-label="메뉴">☰</button>
        </div>
        {mobileMenuOpen && (
          <div className="grid grid-cols-2 gap-2 border-t border-white/8 bg-[#06111e] p-3 lg:hidden">
            {[
              [heroCopy.navShow, "#show"], [heroCopy.navRoute, "#transport"], [heroCopy.navFood, "#eat"],
              [heroCopy.navService, "#painpoints"], [heroCopy.navAi, "#now-ai"], [heroCopy.navMy, "#my-event"],
            ].map(([label, href]) => <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-xl border border-white/10 bg-white/[.03] px-3 py-3 text-center text-xs font-bold">{label}</a>)}
          </div>
        )}
      </header>

      <div className="lg:hidden"><PremiumHero copy={heroCopy} accent={current.accent} showStart={showStart} /></div>

      <section id="show" className="mx-auto w-full max-w-[1560px] px-4 py-5 sm:px-6 lg:px-8 lg:pt-10">
        <div id="service-detail" className="scroll-mt-24" />
        <div className="grid gap-3 lg:grid-cols-3">
          <TodayShowCard showStart={showStart} accent={current.accent} />
          <LiveNowWidget issues={issues} />
          <AiRecommendCard accent={current.accent} />
        </div>
      </section>

      <PromoBanner accent={current.accent} />

      <section className="mx-auto w-full max-w-4xl px-6 py-10">
        <div id="my-event" className="arena-glass rounded-2xl p-4" aria-label="MY EVENT 요약">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-widest text-[var(--arena-muted)]">{heroCopy.navMy}</p>
              <strong className="mt-1 block text-sm">오늘의 공연 · 19:00</strong>
              <p className="mt-1 text-[11px] text-[var(--arena-muted)]">{transport ? `${transport === "car" ? "자가용" : transport === "transit" ? "대중교통" : "택시"} 기준으로 NOW AI가 준비합니다.` : "이동수단을 고르면 필요한 것만 먼저 보여드립니다."}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: `${current.accent}22`, color: current.accent }}>{badge}</span>
          </div>
        </div>

        <div id="transport" className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--arena-muted)]">오늘 어떻게 오세요?</p>
            <TransportSelector value={transport} onChange={setTransport} />
            {!transport && <p className="mt-2 text-[10px]" style={{ color: current.accent }}>처음 한 번만 선택하면 다음 방문부터 기억합니다.</p>}
          </div>
          <button onClick={() => transport && setNowOpen((v) => !v)} disabled={!transport} className="flex h-[68px] flex-col items-center justify-center rounded-2xl px-6 font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ background: current.accent, color: "#05060a" }}>
            <span className="text-lg" style={{ fontFamily: "var(--arena-font-display)" }}>NOW</span><small className="text-[9px]">지금 해야 할 일</small>
          </button>
        </div>

        {nowOpen && predictions[0] && (
          <div className="arena-glass-strong mt-3 flex flex-col gap-2 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><strong className="text-sm">NOW AI가 먼저 골랐습니다</strong><p className="mt-1 text-xs text-[var(--arena-muted)]">{predictions[0].title} → {predictions[0].detail}</p></div>
            <button onClick={() => document.getElementById("now-ai")?.scrollIntoView({ behavior: "smooth" })} className="shrink-0 rounded-full px-4 py-2 text-xs font-bold" style={{ background: current.accent, color: "#05060a" }}>3가지 모두 보기</button>
          </div>
        )}

        <div className="mt-4"><QuickActions state={stateKey} accent={current.accent} /></div>
        <div className="mt-5 flex flex-col items-center gap-3"><ModeSwitcher mode={mode} onChange={setMode} />{mode === "auto" ? <p className="text-center text-[11px] text-[var(--arena-muted)]">예시 공연 기준 자동 계산 · 실 데이터 아님</p> : null}</div>
        {currentAlert && <p className="mt-3 text-center text-[10px] text-[var(--arena-muted)]"><span style={{ color: current.accent }}>SMART ALERT</span> · {currentAlert.message}</p>}
      </section>

      <PredictiveAI predictions={predictions} accent={current.accent} />
      <SmartAlertFeed stateKey={stateKey} accent={current.accent} />
      <LiveIssueBoard issues={issues} setIssues={setIssues} accent={current.accent} />
      <ParkSection accent={current.accent} />
      <EatArenaZoneSection accent={current.accent} />
      <ToiletNowSection accent={current.accent} />
      <GoHomeSection accent={current.accent} />

      <details className="group mx-auto w-full max-w-4xl px-6 py-6">
        <summary className="arena-glass cursor-pointer list-none rounded-2xl p-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/30">전체 서비스 보기 <span className="float-right text-[var(--arena-muted)] group-open:rotate-180">⌄</span></summary>
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10"><FrictionZeroSection accent={current.accent} /><ShowDayTimeline accent={current.accent} /><AroundChips accent={current.accent} /><CompanionTimeSection accent={current.accent} /></div>
      </details>

      <VoiceBoard accent={current.accent} />
      <FloatingNavigator accent={current.accent} />

      <div className="mx-auto w-full max-w-4xl px-6 pb-8 pt-4 text-center">
        <p className="text-xs text-[var(--arena-muted)]">ARENA NOW는 공연 당일의 불편을 줄이는 Event-Day OS 컨셉입니다. 표시되는 일정·혼잡·교통·매장 값은 현재 데모이며, 배경 이미지는 AI 생성 컨셉 이미지로 실제 시설 및 배치와 다를 수 있습니다.</p>
        <a href={SHOWDAY_URL} className="mt-4 inline-block rounded-full border px-6 py-2.5 text-xs" style={{ borderColor: "var(--arena-border)" }}>SHOWDAY 메인으로 돌아가기</a>
      </div>

      <SiteFooter tagline={heroCopy.footerTagline} />
      <CopyEditor onChange={setHeroCopy} />
    </main>
  );
}
