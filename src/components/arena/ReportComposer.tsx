"use client";

import { useEffect, useState } from "react";
import { categoryOptions, IssueCategory } from "@/lib/arena/liveIssues";

const categoryIcon: Record<IssueCategory, string> = {
  주차: "🚗",
  화장실: "🚻",
  입장: "🚪",
  먹거리: "🍔",
  교통: "🚇",
  안전: "⚠️",
  기타: "📍",
};

const ageBands = ["10대 이하", "20대", "30대", "40대", "50대", "60대", "70대+"];
const AGE_KEY = "arena-demo-age-band";

// 3단계 이내: 카테고리 선택 → 한 줄 작성 → 등록.
// 운영 시 연령대는 카카오/회원 프로필에서 자동 연결하고 공개 화면에는 노출하지 않습니다.
export default function ReportComposer({
  accent,
  onSubmit,
}: {
  accent: string;
  onSubmit: (category: IssueCategory, text: string, ageBand?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [ageBand, setAgeBand] = useState("50대");
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(AGE_KEY);
    if (saved && ageBands.includes(saved)) setAgeBand(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AGE_KEY, ageBand);
  }, [ageBand]);

  const reset = () => {
    setOpen(false);
    setCategory(null);
    setText("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="arena-glass w-full rounded-md py-3 text-sm text-[var(--arena-muted)] transition-colors hover:text-[var(--arena-text)]"
      >
        ＋ 지금 현장 알려주기
      </button>
    );
  }

  return (
    <div className="arena-glass-strong rounded-md p-4">
      {!category ? (
        <>
          <p className="mb-3 text-xs text-[var(--arena-muted)]">1/2 · 어떤 종류인가요?</p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="rounded-full border border-[var(--arena-border)] px-3 py-1.5 text-xs transition-colors hover:border-white/40"
              >
                {categoryIcon[c]} {c}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mb-3 text-xs text-[var(--arena-muted)]">
            2/2 · {categoryIcon[category]} {category} — 한 줄로 알려주세요
          </p>
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="text-[11px] text-[var(--arena-muted)] sm:w-36">
              연령대
              <span className="mt-0.5 block text-[9px]">(운영 시 프로필 자동 연결)</span>
              <select
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--arena-border)] bg-transparent px-2 py-1.5 text-xs text-[var(--arena-text)]"
              >
                {ageBands.map((a) => (
                  <option key={a} value={a} className="bg-[#0c0a16]">
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <input
              autoFocus
              value={text}
              maxLength={120}
              onChange={(e) => setText(e.target.value)}
              placeholder="예: 여자 화장실 줄이 많이 길어요"
              className="w-full rounded-md border border-[var(--arena-border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--arena-muted)] focus:outline-none"
            />
            <button
              disabled={!text.trim()}
              onClick={() => {
                onSubmit(category, text.trim(), ageBand);
                reset();
              }}
              className="shrink-0 rounded-md px-4 py-2 text-xs font-bold disabled:opacity-30"
              style={{ background: accent, color: "#05060a" }}
            >
              등록
            </button>
          </div>
          <p className="text-[9px] text-[var(--arena-muted)]">연령대는 분석용으로만 집계하며 공개 제보 카드에는 표시하지 않습니다.</p>
        </>
      )}
      <button onClick={reset} className="mt-2 text-[11px] text-[var(--arena-muted)] underline underline-offset-2">
        취소
      </button>
    </div>
  );
}
