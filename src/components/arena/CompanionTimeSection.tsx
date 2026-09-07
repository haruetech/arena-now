"use client";

import { useState } from "react";

const durationOptions = [
  { minutes: "90 MIN", title: "가볍게 쉬기", body: "카페 · 산책 · 가까운 식사" },
  { minutes: "120 MIN", title: "문화 한 코스", body: "소규모 전시 · 토크 · 식사" },
  { minutes: "180 MIN", title: "COMPANION PROGRAM", body: "50+ 강연 · AI 클래스 · 음악 · 웰니스" },
];

const categories = ["강연", "AI 클래스", "명상", "음악", "소극장 공연", "건강", "문화체험", "식사", "산책"];

const courseExample = [
  { time: "18:50", label: "체크인" },
  { time: "19:10", label: "토크 프로그램" },
  { time: "20:10", label: "Tea Break" },
  { time: "20:30", label: "음악 프로그램" },
  { time: "21:20", label: "MEET POINT로 이동" },
];

// COMPANION TIME: 부모로 한정하지 않습니다.
// 관람하지 않는 가족·친구·보호자 누구나의 2~3시간을 위한 프로그램입니다.
export default function CompanionTimeSection({ accent }: { accent: string }) {
  const [selected, setSelected] = useState(durationOptions[2].minutes);

  return (
    <section id="companion" className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="arena-glass rounded-lg p-8">
        <p className="mb-1 text-xs tracking-wide" style={{ color: accent }}>
          COMPANION TIME
        </p>
        <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
          기다리는 시간이 아니라, 동행자만의 시간
        </h2>
        <p className="mb-6 text-sm text-[var(--arena-muted)]">
          부모님, 친구, 보호자 — 누구든 관람하지 않는 동행자를 위한 코스입니다.
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {durationOptions.map((d) => (
            <button
              key={d.minutes}
              onClick={() => setSelected(d.minutes)}
              className="rounded-md p-4 text-left transition-colors"
              style={{
                background: selected === d.minutes ? `${accent}1a` : "var(--arena-glass)",
                border: `1px solid ${selected === d.minutes ? accent : "var(--arena-border)"}`,
              }}
            >
              <span className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
                {d.minutes}
              </span>
              <p className="mt-2 text-sm font-bold">{d.title}</p>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">{d.body}</p>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: "var(--arena-border)", color: "var(--arena-text)" }}
            >
              {c}
            </span>
          ))}
        </div>

        <p className="mb-3 text-xs text-[var(--arena-muted)]">
          예시 코스 · {selected} · 공연 19:00–21:30 기준
        </p>
        <div className="flex flex-wrap gap-3">
          {courseExample.map((p) => (
            <div key={p.time} className="arena-glass rounded-md px-4 py-3">
              <p className="text-xs tabular-nums" style={{ fontFamily: "var(--arena-font-display)", color: accent }}>
                {p.time}
              </p>
              <p className="mt-1 text-sm">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
