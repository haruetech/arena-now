import { ArenaStateKey } from "./states";

export interface ShowSchedule {
  start: Date;
  end: Date;
}

export interface ComputedArenaState {
  key: ArenaStateKey;
  daysUntil: number;
  minutesUntil: number;
}

const MIN = 60_000;

// 운영 단계 기준값. 실제 공연 시작/종료시간이 연결되면 11단계 전환이
// 이 함수 하나로 자동 처리됩니다. DEMO 전환기는 이 계산과 별개로 남겨둡니다.
export function computeArenaState(now: Date, schedule: ShowSchedule): ComputedArenaState {
  const minutesUntil = Math.floor((schedule.start.getTime() - now.getTime()) / MIN);

  if (now.getTime() >= schedule.end.getTime()) return { key: "showEnded", daysUntil: 0, minutesUntil };
  if (now.getTime() >= schedule.start.getTime()) return { key: "onStage", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 30) return { key: "doorsOpen", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 60) return { key: "sixtyMinutes", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 90) return { key: "ninetyMinutes", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 120) return { key: "twoHours", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 180) return { key: "threeHours", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 240) return { key: "fourHours", daysUntil: 0, minutesUntil };
  if (minutesUntil <= 300) return { key: "fiveHours", daysUntil: 0, minutesUntil };
  if (now.toDateString() === schedule.start.toDateString()) {
    return { key: "fiveHours", daysUntil: 0, minutesUntil };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.toDateString() === schedule.start.toDateString()) {
    return { key: "tomorrow", daysUntil: 1, minutesUntil };
  }

  return { key: "upcoming", daysUntil: Math.max(2, Math.ceil(minutesUntil / 1440)), minutesUntil };
}

/**
 * 데모/프로토타입용 예시 공연 일정.
 * "오늘 19:00 시작, 21:30 종료"를 기준으로 삼아, 지금 시각에 따라
 * 상태가 실제로 어떻게 바뀌는지 확인할 수 있습니다. 실 데이터가 아닙니다.
 */
export function getExampleSchedule(now: Date): ShowSchedule {
  const start = new Date(now);
  start.setHours(19, 0, 0, 0);
  const end = new Date(start);
  end.setHours(21, 30, 0, 0);
  return { start, end };
}
