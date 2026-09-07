"use client";

import { useEffect, useState } from "react";
import { arenaStates, ArenaStateKey } from "@/lib/arena/states";
import { computeArenaState, getExampleSchedule } from "@/lib/arena/schedule";
import ArenaSkyline from "@/components/arena/ArenaSkyline";
import StateSwitcher from "@/components/arena/StateSwitcher";
import ModeSwitcher, { ArenaMode } from "@/components/arena/ModeSwitcher";
import ShowDayTimeline from "@/components/arena/ShowDayTimeline";
import ThreeHoursTeaser from "@/components/arena/ThreeHoursTeaser";
import AroundChips from "@/components/arena/AroundChips";

// ARENA NOW — arena.showday.kr 전용 독립 앱.
// SHOWDAY(showday.kr)와는 완전히 분리된 저장소/배포이며, 디자인 방향을
// 검증하는 컨셉 프로토타입입니다. docs/arena-now-vision.md가 기준 문서입니다.
//
// 상태는 두 가지 방식으로 결정됩니다:
// - "자동 계산": 예시 공연 일정(오늘 19:00~21:30) 기준으로 현재 시각에 맞춰 자동 전환
//   (실 데이터 연결 시 getExampleSchedule 대신 실제 공연 시작/종료시간만 넘기면 됨)
// - "데모로 미리보기": 제안/시연용으로 7단계를 직접 눌러보는 수동 전환기

const SHOWDAY_URL = "https://showday.kr";

export default function ArenaNowPage() {
  const [mode, setMode] = useState<ArenaMode>("demo");
  const [demoKey, setDemoKey] = useState<ArenaStateKey>("liveDay");
  const [autoResult, setAutoResult] = useState(() => computeArenaState(new Date(), getExampleSchedule(new Date())));

  useEffect(() => {
    if (mode !== "auto") return;
    const tick = () => setAutoResult(computeArenaState(new Date(), getExampleSchedule(new Date())));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [mode]);

  const stateKey = mode === "auto" ? autoResult.key : demoKey;
  const current = arenaStates.find((s) => s.key === stateKey)!;
  const badge =
    mode === "auto" && stateKey === "upcoming"
      ? `NEXT SHOW · D-${autoResult.daysUntil}`
      : current.badge;

  return (
    <main className="relative">
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-700"
        style={{ background: `var(--arena-bg-glow), var(--arena-bg)` }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 50% 30% at 50% 15%, ${current.glow}, transparent 70%)` }}
      />

      {/* 상단 바 */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 pt-6">
        <a href={SHOWDAY_URL} className="text-xs text-[var(--arena-muted)] hover:text-[var(--arena-text)]">
          ← SHOWDAY
        </a>
        <span className="arena-glass rounded-full px-3 py-1 text-[10px] tracking-wide text-[var(--arena-muted)]">
          CONCEPT PROTOTYPE
        </span>
      </div>

      {/* HERO */}
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <div className="text-center">
          <p
            className="mb-1 text-sm font-bold tracking-tight"
            style={{ fontFamily: "var(--arena-font-display)" }}
          >
            THE SHOW STARTS BEFORE THE SHOW.
          </p>
          <p className="mb-6 text-xs text-[var(--arena-muted)]">
            공연은 입장 전에 이미 시작됩니다.
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
          <h1
            className="whitespace-pre-line text-3xl leading-tight sm:text-4xl"
            style={{ fontFamily: "var(--arena-font-display)" }}
          >
            {current.headline}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--arena-muted)]">{current.sub}</p>
        </div>

        <ArenaSkyline accent={current.accent} />

        <div className="flex flex-col items-center gap-4">
          <button
            className="rounded-full px-8 py-3.5 text-sm font-bold transition-transform hover:scale-105"
            style={{ background: current.accent, color: "#05060a" }}
          >
            {current.cta}
          </button>

          <ModeSwitcher mode={mode} onChange={setMode} />

          {mode === "auto" ? (
            <p className="text-center text-[11px] text-[var(--arena-muted)]">
              예시 공연(오늘 19:00 시작 · 21:30 종료) 기준으로 현재 시각에 맞춰
              자동 계산됩니다. 실 데이터 연동 전 예시입니다.
            </p>
          ) : (
            <StateSwitcher current={demoKey} onChange={setDemoKey} />
          )}
        </div>
      </section>

      <ShowDayTimeline accent={current.accent} />
      <ThreeHoursTeaser accent={current.accent} />
      <AroundChips accent={current.accent} />

      {/* AFTER SHOW */}
      <section id="after" className="mx-auto w-full max-w-4xl px-6 py-16">
        <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">AFTER SHOW</p>
        <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
          공연이 끝나도, SHOW DAY는 계속됩니다
        </h2>
        <p className="mb-6 text-xs text-[var(--arena-muted)]">
          * 아래 값은 예시(DEMO)이며, 실제 교통·매장 데이터 연동 전까지는
          운영값이 아닙니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "막차", value: "01:42 남음" },
            { label: "택시", value: "호출 3분" },
            { label: "주차장 출차", value: "안내 준비 중" },
            { label: "숙박", value: "지방 방문객용" },
          ].map((item) => (
            <div key={item.label} className="arena-glass relative rounded-md p-4 text-center">
              <span className="absolute right-2 top-2 rounded-full border border-[var(--arena-border)] px-1.5 py-0.5 text-[9px] text-[var(--arena-muted)]">
                DEMO
              </span>
              <p className="text-xs text-[var(--arena-muted)]">{item.label}</p>
              <p className="mt-1 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-4xl px-6 py-12 text-center">
        <p className="text-xs text-[var(--arena-muted)]">
          이 페이지는 디자인 컨셉 프로토타입입니다. 실제 서울아레나 제휴·개관
          여부와 무관하며, 조감도는 서울아레나를 그대로 재현하지 않은 미래형
          아레나 컨셉 일러스트입니다.
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
