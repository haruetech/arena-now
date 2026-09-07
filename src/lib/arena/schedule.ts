import { ArenaStateKey } from "./states";

export interface ShowSchedule {
  start: Date;
  end: Date;
}

// 운영 단계 기준값. 실제 공연 시작/종료시간이 연결되면 이 상수만으로
// LIVE DAY → 3 HOURS TO SHOW → DOORS OPEN → ON STAGE → SHOW ENDED가
// 자동으로 전환됩니다. DEMO 전환기는 이 계산과 별개로 항상 남겨둡니다.
const DOORS_OPEN_BEFORE_MIN = 30;
const THREE_HOURS_BEFORE_MIN = 180;

export interface ComputedArenaState {
  key: ArenaStateKey;
  daysUntil: number;
}

export function computeArenaState(now: Date, schedule: ShowSchedule): ComputedArenaState {
  const minUntilStart = (schedule.start.getTime() - now.getTime()) / 60000;

  if (now.getTime() >= schedule.end.getTime()) return { key: "showEnded", daysUntil: 0 };
  if (now.getTime() >= schedule.start.getTime()) return { key: "onStage", daysUntil: 0 };
  if (minUntilStart <= DOORS_OPEN_BEFORE_MIN) return { key: "doorsOpen", daysUntil: 0 };
  if (minUntilStart <= THREE_HOURS_BEFORE_MIN) return { key: "threeHours", daysUntil: 0 };

  if (now.toDateString() === schedule.start.toDateString()) {
    return { key: "liveDay", daysUntil: 0 };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.toDateString() === schedule.start.toDateString()) {
    return { key: "tomorrow", daysUntil: 1 };
  }

  const daysUntil = Math.max(1, Math.ceil(minUntilStart / (60 * 24)));
  return { key: "upcoming", daysUntil };
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
