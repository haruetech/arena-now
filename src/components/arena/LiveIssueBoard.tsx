"use client";

import { useState } from "react";
import { LiveIssue, IssueCategory, reportIssue, severityMeta, minutesAgo, isIssueFresh } from "@/lib/arena/liveIssues";
import ReportComposer from "./ReportComposer";

const categoryIcon: Record<string, string> = {
  주차: "🚗",
  화장실: "🚻",
  입장: "🚪",
  먹거리: "🍔",
  교통: "🚇",
  안전: "⚠️",
  기타: "📍",
};

const severityOrder: LiveIssue["severity"][] = ["critical", "important", "onsite", "general"];

export default function LiveIssueBoard({
  issues,
  setIssues,
  accent,
}: {
  issues: LiveIssue[];
  setIssues: (fn: (prev: LiveIssue[]) => LiveIssue[]) => void;
  accent: string;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const now = Date.now();

  const handleSubmit = (category: IssueCategory, text: string, ageBand?: string) => {
    let escalatedFlag = false;
    setIssues((prev) => {
      const result = reportIssue(prev, { category, text, ageBand }, Date.now());
      escalatedFlag = result.escalated;
      return result.issues;
    });
    setToast(
      escalatedFlag
        ? "🟠 제보가 누적되어 조건에 맞는 사용자에게 알림이 1회 발송됐습니다 (데모)"
        : "실시간 화면에 반영됐습니다. 제보가 쌓이면 자동으로 승격됩니다."
    );
    setTimeout(() => setToast(null), 4000);
  };

  const sorted = issues.filter((issue) => isIssueFresh(issue, now)).sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));

  return (
    <section id="live-issues" className="mx-auto w-full max-w-4xl px-6 py-16">
      <p className="mb-1 text-xs tracking-wide text-[var(--arena-muted)]">LIVE ISSUE</p>
      <h2 className="mb-2 text-2xl sm:text-3xl" style={{ fontFamily: "var(--arena-font-display)" }}>
        관객이 곧 현장 센서입니다
      </h2>
      <p className="mb-6 text-sm text-[var(--arena-muted)]">
        VOICE(일반 의견)와 분리된 실시간 현장 제보입니다. 지금 다른 관객에게
        도움이 되는 것만 빠르게 올라오고, 비슷한 제보는 AI가 하나로 합칩니다. 오래된 관람객 제보는 자동으로 내려갑니다.
      </p>

      {/* 등급 정책 */}
      <div className="mb-8 grid gap-2 sm:grid-cols-4">
        {(Object.keys(severityMeta) as LiveIssue["severity"][]).map((key) => (
          <div key={key} className="arena-glass rounded-md p-3">
            <p className="text-xs font-bold" style={{ color: severityMeta[key].color }}>
              {severityMeta[key].label}
            </p>
            <p className="mt-1 text-[11px] text-[var(--arena-muted)]">{severityMeta[key].push}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <ReportComposer accent={accent} onSubmit={handleSubmit} />
      </div>

      {toast && (
        <div className="arena-glass-strong mb-6 rounded-md px-4 py-3 text-xs" style={{ color: accent }}>
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map((issue) => (
          <div key={issue.id} className="arena-glass rounded-md p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${severityMeta[issue.severity].color}22`, color: severityMeta[issue.severity].color }}
              >
                {severityMeta[issue.severity].label}
              </span>
              <span className="text-[11px] text-[var(--arena-muted)]">
                {categoryIcon[issue.category]} {issue.category}
              </span>
              <span
                className="rounded-full border px-2 py-0.5 text-[10px]"
                style={{
                  borderColor: issue.source === "official" ? accent : "var(--arena-border)",
                  color: issue.source === "official" ? accent : "var(--arena-muted)",
                }}
              >
                {issue.source === "official" ? "공식 안내 ✓" : "관람객 제보 👥"}
              </span>
            </div>
            <p className="text-sm font-bold">{issue.title}</p>
            <p className="mt-1 text-xs text-[var(--arena-muted)]">{issue.detail}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-[var(--arena-muted)]">
                {issue.source === "crowd"
                  ? `최근 ${minutesAgo(issue.firstReportedAt, now)} · 제보 ${issue.reportCount}건`
                  : `${minutesAgo(issue.firstReportedAt, now)} 안내`}
              </p>
              {issue.actionLabel && (
                <span className="text-[11px] underline underline-offset-2" style={{ color: accent }}>
                  {issue.actionLabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
