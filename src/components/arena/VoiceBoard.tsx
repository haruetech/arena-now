"use client";

import { useEffect, useMemo, useState } from "react";

interface VoiceEntry {
  id: string;
  category: string;
  text: string;
  reaction: string;
  count: number;
  ageBand: string;
}

const categories = ["불편했어요", "개선해주세요", "보고 싶은 공연", "좋았어요", "아이디어", "접근성 개선"];
const ageBands = ["10대 이하", "20대", "30대", "40대", "50대", "60대", "70대+"];
const AGE_KEY = "arena-demo-age-band";

const initialEntries: VoiceEntry[] = [
  { id: "v1", category: "불편했어요", text: "여자 화장실 대기줄이 길어요.", reaction: "나도 그래요", count: 184, ageBand: "50대" },
  { id: "v2", category: "개선해주세요", text: "주차장 출차 안내가 필요해요.", reaction: "나도 그래요", count: 96, ageBand: "40대" },
  { id: "v3", category: "보고 싶은 공연", text: "8090 콘서트를 보고 싶어요.", reaction: "나도 보고 싶어요", count: 231, ageBand: "60대" },
  { id: "v4", category: "아이디어", text: "동행자와 만날 장소를 정해주면 좋겠어요.", reaction: "나도 그래요", count: 58, ageBand: "30대" },
];

export default function VoiceBoard({ accent }: { accent: string }) {
  const [entries, setEntries] = useState(initialEntries);
  const [category, setCategory] = useState(categories[0]);
  const [ageBand, setAgeBand] = useState("50대");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(AGE_KEY);
    if (saved && ageBands.includes(saved)) setAgeBand(saved);
  }, []);
  useEffect(() => {
    window.localStorage.setItem(AGE_KEY, ageBand);
  }, [ageBand]);

  const insight = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((e) => counts.set(e.ageBand, (counts.get(e.ageBand) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [entries]);

  const react = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, count: e.count + 1 } : e)));
  };

  const submit = () => {
    const clean = text.trim();
    if (!clean) return;
    const reaction = category === "보고 싶은 공연" ? "나도 보고 싶어요" : "나도 그래요";
    setEntries((prev) => [
      { id: `v-${Date.now()}`, category, text: clean, reaction, count: 0, ageBand },
      ...prev,
    ]);
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <section id="voice" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">VOICE · ⚪ 일반 의견</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        관객의 한마디가 데이터가 됩니다
      </h2>
      <p className="mb-6 text-xs text-[var(--arena-muted)]">
        지금 급한 현장 이슈는 LIVE ISSUE로, 공연 개선·보고 싶은 공연·아이디어는 VOICE에 남깁니다.
      </p>

      <div className="arena-glass mb-6 rounded-md p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className="rounded-full px-3 py-1.5 text-xs transition-colors"
              style={{ background: category === c ? accent : "transparent", color: category === c ? "#05060a" : "var(--arena-muted)", border: `1px solid ${category === c ? accent : "var(--arena-border)"}` }}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="text-xs text-[var(--arena-muted)] sm:w-40">
            연령대 <span className="mt-0.5 block text-[10px]">(운영 시 프로필 자동 연결)</span>
            <select value={ageBand} onChange={(e) => setAgeBand(e.target.value)} className="mt-1 w-full rounded-md border border-[var(--arena-border)] bg-transparent px-2 py-2 text-xs text-[var(--arena-text)]">
              {ageBands.map((a) => <option key={a} value={a} className="bg-[#0c0a16]">{a}</option>)}
            </select>
          </label>
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} placeholder={`${category} — 한두 문장만 남겨주세요`} className="w-full rounded-md border border-[var(--arena-border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--arena-muted)] focus:outline-none" />
          <button onClick={submit} disabled={!text.trim()} className="shrink-0 rounded-md px-4 py-2 text-xs font-bold disabled:opacity-30" style={{ background: accent, color: "#05060a" }}>
            {sent ? "반영됐어요 ✓" : "한마디 남기기"}
          </button>
        </div>
        <p className="mt-2 text-[9px] text-[var(--arena-muted)]">연령대는 분석용 태그이며 공개 의견 카드에는 표시하지 않습니다.</p>
      </div>

      <div className="arena-glass mb-5 rounded-md p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold">VOICE INSIGHT · DEMO</p>
            <p className="mt-1 text-[10px] text-[var(--arena-muted)]">게시판은 하나로 유지하고 뒤에서 연령대별로 자동 집계합니다.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5">
            {insight.map(([age, count]) => <span key={age} className="rounded-full border border-[var(--arena-border)] px-2 py-1 text-[10px] text-[var(--arena-muted)]">{age} · {count}</span>)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map((e) => (
          <div key={e.id} className="arena-glass flex items-center justify-between gap-4 rounded-md p-4">
            <div>
              <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: `${accent}1a`, color: accent }}>{e.category}</span>
              <p className="mt-2 text-sm">{e.text}</p>
            </div>
            <button onClick={() => react(e.id)} className="arena-glass-strong shrink-0 rounded-full px-3 py-1.5 text-xs transition-transform hover:scale-105">{e.reaction} · {e.count}</button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-[var(--arena-muted)]">운영 단계에서는 공연·관람 여부·동행 형태·연령대·의견 종류·공감 수를 함께 분석해 시설 개선과 공연 수요 데이터로 활용합니다.</p>
    </section>
  );
}
