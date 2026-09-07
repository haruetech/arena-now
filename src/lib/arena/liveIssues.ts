// LIVE ISSUE — VOICE와 분리된 실시간 현장 제보 레이어.
// VOICE(⚪ 일반 의견)와 달리, 지금 다른 관객에게 도움이 되는 현장 이슈만
// 빠르게 올라오고, 비슷한 제보는 AI가 병합해서 하나의 카드로 보여줍니다.
//
// 중요: 관람객 제보는 틀릴 수 있으므로 "공식 안내"와 절대 섞지 않습니다.
// AI는 병합·에스컬레이션만 하고, 제보를 공식 사실로 바꾸지 않습니다.

export type IssueSeverity = "critical" | "important" | "onsite" | "general";
export type IssueCategory = "주차" | "화장실" | "입장" | "먹거리" | "교통" | "안전" | "기타";
export type IssueSource = "official" | "crowd";

export interface LiveIssue {
  id: string;
  category: IssueCategory;
  title: string; // 병합된 대표 문구
  detail: string;
  severity: IssueSeverity;
  source: IssueSource;
  reportCount: number;
  firstReportedAt: number; // epoch ms
  lastReportedAt: number;
  actionLabel?: string;
  ageBreakdown?: Record<string, number>; // 공개용이 아닌 내부 분석 태그
}

export const severityMeta: Record<IssueSeverity, { label: string; color: string; push: string }> = {
  critical: { label: "🔴 긴급", color: "#f43f5e", push: "즉시 푸시" },
  important: { label: "🟠 중요", color: "#fb923c", push: "조건 맞는 사용자에게 1회 알림" },
  onsite: { label: "🟡 현장", color: "#fbbf24", push: "LIVE 화면에만 표시" },
  general: { label: "⚪ 일반", color: "#94a3b8", push: "VOICE에만 축적" },
};

export const categoryOptions: IssueCategory[] = ["주차", "화장실", "입장", "먹거리", "교통", "기타"];

// 크라우드 제보는 이 건수 이상 모이면 "현장(🟡)"에서 "중요(🟠)"로 자동 승격됩니다.
// 🔴 긴급은 안전·게이트 변경처럼 공식 출처에서만 부여합니다 — 제보 건수만으로는
// 절대 긴급으로 올리지 않습니다(오탐 방지 원칙).
export const ESCALATION_THRESHOLD = 10;
const MERGE_WINDOW_MS = 30 * 60 * 1000;

export function seedLiveIssues(now: number): LiveIssue[] {
  return [
    {
      id: "official-1",
      category: "안전",
      title: "B게이트 반입 규정 안내",
      detail: "우산은 접이식만 반입 가능합니다. 장우산은 물품보관소를 이용해주세요.",
      severity: "important",
      source: "official",
      reportCount: 0,
      firstReportedAt: now - 20 * 60 * 1000,
      lastReportedAt: now - 20 * 60 * 1000,
    },
    {
      id: "crowd-1",
      category: "화장실",
      title: "화장실 혼잡 증가",
      detail: "2층 여자 화장실 대기줄이 길어요.",
      severity: "important",
      source: "crowd",
      reportCount: 17,
      firstReportedAt: now - 10 * 60 * 1000,
      lastReportedAt: now - 1 * 60 * 1000,
      actionLabel: "1층 화장실 확인하기 →",
    },
    {
      id: "crowd-2",
      category: "입장",
      title: "B·2번 게이트 혼잡",
      detail: "2번 게이트 줄이 엄청 길어요 / B게이트 사람 너무 많습니다.",
      severity: "important",
      source: "crowd",
      reportCount: 24,
      firstReportedAt: now - 8 * 60 * 1000,
      lastReportedAt: now - 2 * 60 * 1000,
      actionLabel: "다른 입구 확인 →",
    },
    {
      id: "crowd-3",
      category: "주차",
      title: "동문 주차장 혼잡",
      detail: "동문 쪽 주차장 진입이 오래 걸려요.",
      severity: "onsite",
      source: "crowd",
      reportCount: 4,
      firstReportedAt: now - 6 * 60 * 1000,
      lastReportedAt: now - 3 * 60 * 1000,
    },
  ];
}

/**
 * 데모용 간단 병합 규칙: 같은 카테고리 + 최근 30분 이내 크라우드 제보는
 * 하나의 이슈로 합칩니다. 실제 서비스에서는 문장 임베딩 유사도 기반으로
 * "2번 게이트"와 "B게이트"처럼 다른 표현도 같은 이슈로 묶어야 합니다.
 */
export function reportIssue(
  issues: LiveIssue[],
  input: { category: IssueCategory; text: string; ageBand?: string },
  now: number
): { issues: LiveIssue[]; escalated: boolean; matchedId: string } {
  const candidate = issues.find(
    (i) => i.source === "crowd" && i.category === input.category && now - i.lastReportedAt < MERGE_WINDOW_MS
  );

  if (candidate) {
    const newCount = candidate.reportCount + 1;
    const wasImportant = candidate.severity === "important";
    const nowImportant = newCount >= ESCALATION_THRESHOLD;
    const nextAge = { ...(candidate.ageBreakdown ?? {}) };
    if (input.ageBand) nextAge[input.ageBand] = (nextAge[input.ageBand] ?? 0) + 1;
    const updated: LiveIssue = {
      ...candidate,
      reportCount: newCount,
      lastReportedAt: now,
      severity: nowImportant ? "important" : candidate.severity,
      ageBreakdown: nextAge,
    };
    return {
      issues: issues.map((i) => (i.id === candidate.id ? updated : i)),
      escalated: !wasImportant && nowImportant,
      matchedId: candidate.id,
    };
  }

  const id = `crowd-${now}`;
  const newIssue: LiveIssue = {
    id,
    category: input.category,
    title: input.text,
    detail: input.text,
    severity: "onsite",
    source: "crowd",
    reportCount: 1,
    firstReportedAt: now,
    lastReportedAt: now,
    ageBreakdown: input.ageBand ? { [input.ageBand]: 1 } : undefined,
  };
  return { issues: [newIssue, ...issues], escalated: false, matchedId: id };
}

export function minutesAgo(ts: number, now: number): string {
  const min = Math.max(0, Math.round((now - ts) / 60000));
  return min === 0 ? "방금 전" : `${min}분 전`;
}


// 현장 제보 신선도: 오래된 crowd 이슈는 자동으로 화면에서 내립니다.
// 중요 이슈는 60분, 일반 현장 이슈는 30분 동안 새 제보가 없으면 만료됩니다.
export function isIssueFresh(issue: LiveIssue, now: number): boolean {
  if (issue.source === "official") return true;
  const ttl = issue.severity === "important" ? 60 * 60 * 1000 : 30 * 60 * 1000;
  return now - issue.lastReportedAt <= ttl;
}
