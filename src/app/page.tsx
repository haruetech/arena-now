"use client";

import { useEffect, useMemo, useState } from "react";
import { arenaStates, ArenaStateKey } from "@/lib/arena/states";
import { computeArenaState, getExampleSchedule } from "@/lib/arena/schedule";
import { alertMoments, getAlertIndex } from "@/lib/arena/alerts";
import { getPredictions, TransportMode } from "@/lib/arena/predict";
import { LiveIssue, seedLiveIssues } from "@/lib/arena/liveIssues";
import ArenaSkyline from "@/components/arena/ArenaSkyline";
import StateSwitcher from "@/components/arena/StateSwitcher";
import ModeSwitcher, { ArenaMode } from "@/components/arena/ModeSwitcher";
import TransportSelector from "@/components/arena/TransportSelector";
import QuickActions from "@/components/arena/QuickActions";
import PredictiveAI from "@/components/arena/PredictiveAI";
import SmartAlertFeed from "@/components/arena/SmartAlertFeed";
import LiveNowWidget from "@/components/arena/LiveNowWidget";
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

// ARENA NOW — arena.showday.kr 전용 독립 앱.
// 포지셔닝: 공연정보 사이트가 아니라 "공연 당일 실제 불편을 줄이는 Event-Day OS".
//
// 두 축의 개인화:
// - 상태(11단계, states.ts/schedule.ts): 지금이 언제인지
// - 이동수단(TransportMode, predict.ts): 어떻게 오는지
// 이 둘을 합쳐 NOW AI(PredictiveAI)가 "지금 뭘 하면 좋을지" 3가지로 압축합니다.

const SHOWDAY_URL = "https://showday.kr";

export default function ArenaNowPage() {
  const [mode, setMode] = useState<ArenaMode>("demo");
  const [demoKey, setDemoKey] = useState<ArenaStateKey>("fiveHours");
  const [transport, setTransport] = useState<TransportMode | null>(null);
  const [autoResult, setAutoResult] = useState(() => computeArenaState(new Date(), getExampleSchedule(new Date())));
  const [issues, setIssues] = useState<LiveIssue[]>(() => seedLiveIssues(Date.now()));
  const [nowOpen, setNowOpen] = useState(false);

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
  const badge =
    mode === "auto" && stateKey === "upcoming"
      ? `NEXT SHOW · D-${autoResult.daysUntil}`
      : current.badge;
  const predictions = useMemo(() => transport ? getPredictions(stateKey, transport) : [], [stateKey, transport]);

  return (
    <main className="relative">
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse 55% 32% at 50% 6%, ${current.glow}, transparent 72%), var(--arena-bg)` }}
      />

      {/* 상단 바 */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 pt-6">
        <a href={SHOWDAY_URL} className="text-xs text-[var(--arena-muted)] hover:text-[var(--arena-text)]">
          ← SHOWDAY
        </a>
        <div className="text-center">
          <p className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)" }}>ARENA NOW</p>
          <p className="text-[9px] tracking-widest text-[var(--arena-muted)]">EVENT-DAY OS</p>
        </div>
        <button
          onClick={() => document.getElementById("live-issues")?.scrollIntoView({ behavior: "smooth" })}
          className="arena-glass rounded-full px-3 py-1 text-[10px] tracking-wide text-[var(--arena-muted)]"
        >
          LIVE NOW
        </button>
      </div>

      {/* HERO */}
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <div className="text-center">
          <span className="arena-glass mb-3 inline-block rounded-full px-3 py-1 text-[10px] tracking-wide text-[var(--arena-muted)]">
            CONCEPT PROTOTYPE
          </span>
          <p className="mb-4 text-xs text-[var(--arena-muted)]">
            찾게 하지 않습니다. 지금 필요한 것을 먼저 보여드립니다.
          </p>

          <p
            className={`mb-2 inline-block rounded-full px-4 py-1.5 text-xs tracking-widest ${current.pulse ? "arena-pulse" : ""}`}
            style={{
              fontFamily: "var(--arena-font-display)",
              background: `${current.accent}22`,
              color: current.accent,
              border: `1px solid ${current.accent}55`,
            }}
          >
            {badge}
          </p>
          <h1 className="whitespace-pre-line text-3xl leading-tight sm:text-4xl" style={{ fontFamily: "var(--arena-font-display)" }}>
            {current.headline}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--arena-muted)]">{current.sub}</p>

          {currentAlert && (
            <div className="arena-glass mx-auto mt-4 max-w-sm rounded-full px-4 py-2 text-xs">
              <span style={{ color: current.accent }}>SMART ALERT</span>
              <span className="text-[var(--arena-muted)]"> · {currentAlert.message}</span>
            </div>
          )}

          <div className="mt-4">
            <LiveNowWidget issues={issues} />
          </div>
        </div>

        <ArenaSkyline accent={current.accent} />

        <div className="arena-glass rounded-2xl p-4" aria-label="MY EVENT 요약">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-widest text-[var(--arena-muted)]">MY EVENT</p>
              <strong className="mt-1 block text-sm">오늘의 공연 · 19:00</strong>
              <p className="mt-1 text-[11px] text-[var(--arena-muted)]">{transport ? `${transport === "car" ? "자가용" : transport === "transit" ? "대중교통" : "택시"} 기준으로 NOW AI가 준비합니다.` : "이동수단을 고르면 필요한 것만 먼저 보여드립니다."}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: `${current.accent}22`, color: current.accent }}>{badge}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--arena-muted)]">오늘 어떻게 오세요?</p>
            <TransportSelector value={transport} onChange={setTransport} />
            {!transport && <p className="mt-2 text-[10px]" style={{ color: current.accent }}>처음 한 번만 선택하면 다음 방문부터 기억합니다.</p>}
          </div>
          <button
            onClick={() => transport && setNowOpen((v) => !v)}
            disabled={!transport}
            className="flex h-[68px] disabled:cursor-not-allowed disabled:opacity-40 flex-col items-center justify-center rounded-2xl px-6 font-bold"
            style={{ background: current.accent, color: "#05060a" }}
          >
            <span className="text-lg" style={{ fontFamily: "var(--arena-font-display)" }}>NOW</span>
            <small className="text-[9px]">지금 해야 할 일</small>
          </button>
        </div>

        {nowOpen && predictions[0] && (
          <div className="arena-glass-strong flex flex-col gap-2 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <strong className="text-sm">NOW AI가 먼저 골랐습니다</strong>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">
                {predictions[0].title} → {predictions[0].detail}
              </p>
            </div>
            <button
              onClick={() => document.getElementById("now-ai")?.scrollIntoView({ behavior: "smooth" })}
              className="shrink-0 rounded-full px-4 py-2 text-xs font-bold"
              style={{ background: current.accent, color: "#05060a" }}
            >
              3가지 모두 보기
            </button>
          </div>
        )}

        <QuickActions state={stateKey} accent={current.accent} />

        <div className="flex flex-col items-center gap-3">
          <ModeSwitcher mode={mode} onChange={setMode} />
          {mode === "auto" ? (
            <p className="text-center text-[11px] text-[var(--arena-muted)]">
              예시 공연(오늘 19:00~21:30) 기준 자동 계산 · 실 데이터 아님
            </p>
          ) : (
            <StateSwitcher current={demoKey} onChange={setDemoKey} />
          )}
        </div>
      </section>

      <PredictiveAI predictions={predictions} accent={current.accent} />
      <SmartAlertFeed stateKey={stateKey} accent={current.accent} />
      <LiveIssueBoard issues={issues} setIssues={setIssues} accent={current.accent} />
      <ParkSection accent={current.accent} />
      <EatArenaZoneSection accent={current.accent} />
      <ToiletNowSection accent={current.accent} />
      <GoHomeSection accent={current.accent} />

      <details className="mx-auto w-full max-w-4xl px-6 py-6 group">
        <summary className="arena-glass cursor-pointer list-none rounded-2xl p-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/30">
          전체 서비스 보기 <span className="float-right text-[var(--arena-muted)] group-open:rotate-180">⌄</span>
        </summary>
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
          <FrictionZeroSection accent={current.accent} />
          <ShowDayTimeline accent={current.accent} />
          <AroundChips accent={current.accent} />
          <CompanionTimeSection accent={current.accent} />
        </div>
      </details>
      <VoiceBoard accent={current.accent} />

      <nav className="arena-glass-strong fixed inset-x-3 bottom-3 z-50 mx-auto grid max-w-md grid-cols-4 rounded-2xl p-1.5 sm:hidden" aria-label="빠른 메뉴">
        <button onClick={() => document.getElementById("now-ai")?.scrollIntoView({behavior:"smooth"})} className="rounded-xl px-2 py-2 text-[11px]">NOW</button>
        <button onClick={() => document.getElementById("live-issues")?.scrollIntoView({behavior:"smooth"})} className="rounded-xl px-2 py-2 text-[11px]">LIVE</button>
        <button onClick={() => document.getElementById("park")?.scrollIntoView({behavior:"smooth"})} className="rounded-xl px-2 py-2 text-[11px]">PARK</button>
        <button onClick={() => document.getElementById("voice")?.scrollIntoView({behavior:"smooth"})} className="rounded-xl px-2 py-2 text-[11px]">VOICE</button>
      </nav>

      <footer className="mx-auto w-full max-w-4xl px-6 pb-24 pt-12 text-center sm:py-12">
        <p className="text-xs text-[var(--arena-muted)]">
          ARENA NOW는 공연정보 사이트가 아니라 공연 당일의 불편을 줄이는
          Event-Day OS 컨셉입니다. 현재 표시되는 일정·혼잡·교통·매장 값은
          실제 운영 데이터가 아닙니다. 조감도는 서울아레나를 그대로 재현하지
          않은 미래형 아레나 컨셉 일러스트입니다.
        </p>
        <a
          href={SHOWDAY_URL}
          className="mt-4 inline-block rounded-full border px-6 py-2.5 text-xs"
          style={{ borderColor: "var(--arena-border)" }}
        >
          SHOWDAY 메인으로 돌아가기
        </a>
      </footer>
    </main>
  );
}
