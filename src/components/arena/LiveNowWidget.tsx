"use client";

import { LiveIssue, severityMeta } from "@/lib/arena/liveIssues";

const categoryIcon: Record<string, string> = {
  주차: "🚗",
  화장실: "🚻",
  입장: "🚪",
  먹거리: "🍔",
  교통: "🚇",
  안전: "⚠️",
  기타: "📍",
};

// 메인 화면 어디서나 작게 항상 보이는 위젯. 사용자는 이걸 보고
// 필요할 때만 LIVE ISSUE 전체 화면으로 들어갑니다 — 푸시가 아니라 "보이는" 정보.
export default function LiveNowWidget({ issues }: { issues: LiveIssue[] }) {
  const active = issues.filter((i) => i.severity !== "general").slice(0, 3);
  if (active.length === 0) return null;

  return (
    <a
      href="#live-issues"
      className="arena-glass mx-auto flex w-full max-w-sm flex-col gap-2 rounded-xl px-4 py-3 text-left transition-colors hover:border-white/30"
    >
      <div className="flex items-center gap-2">
        <span className="arena-pulse h-2 w-2 rounded-full bg-rose-400" />
        <span className="text-xs font-bold" style={{ fontFamily: "var(--arena-font-display)" }}>
          LIVE NOW
        </span>
        <span className="text-[10px] text-[var(--arena-muted)]">{active.length}건</span>
      </div>
      <div className="flex flex-col gap-1">
        {active.map((i) => (
          <div key={i.id} className="flex items-center justify-between text-xs">
            <span>
              {categoryIcon[i.category] ?? "📍"} {i.title}
            </span>
            <span style={{ color: severityMeta[i.severity].color }}>{severityMeta[i.severity].label.replace(/^\S+\s/, "")}</span>
          </div>
        ))}
      </div>
      <span className="text-[11px] text-[var(--arena-muted)] underline underline-offset-2">현장 전체 보기 →</span>
    </a>
  );
}
