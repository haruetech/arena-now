import { ArenaStateKey } from "./states";

/**
 * SMART ALERT — "불편이 생기기 전에 먼저 알려주는" 예방형 알림.
 * 11단계 상태머신(states.ts/schedule.ts)에 그대로 얹혀 동작하므로
 * 별도의 시간 계산 로직이 필요 없습니다.
 */

export interface AlertMoment {
  stateKey: ArenaStateKey;
  order: number;
  title: string;
  message: string;
  tag: string;
}

export const alertMoments: AlertMoment[] = [
  { stateKey: "upcoming", order: 0, title: "오늘의 체크", message: "주차·입장·준비물·귀가 핵심을 미리 확인하세요.", tag: "CHECKLIST" },
  { stateKey: "tomorrow", order: 1, title: "날씨·준비", message: "내일 공연입니다. 날씨와 이동수단, 주차 옵션을 미리 확인하세요.", tag: "WEATHER" },
  { stateKey: "fiveHours", order: 2, title: "주차 먼저", message: "자가용이면 지금 주차 후보 3곳을 정하고 출발 동선을 준비하세요.", tag: "PARK" },
  { stateKey: "fourHours", order: 3, title: "동선 확정", message: "주차 위치에서 공연장까지 식사·이동 동선을 확정하세요.", tag: "PARK · EAT" },
  { stateKey: "threeHours", order: 4, title: "식사·짐·현장행사", message: "도착 후 식사·짐보관·현장 팝업 순서를 확인하세요.", tag: "EAT · BAG" },
  { stateKey: "twoHours", order: 5, title: "이동 우선", message: "이제 긴 식사보다 이동이 우선입니다. 공연장으로 출발하세요.", tag: "MOVE" },
  { stateKey: "ninetyMinutes", order: 6, title: "입장 준비 시작", message: "화장실·짐보관·MD·내 입구를 가까운 순서로 확인하세요.", tag: "TOILET · BAG" },
  { stateKey: "sixtyMinutes", order: 7, title: "입장·화장실", message: "이제 공연장 주변이에요. 화장실·게이트를 확인하고 입장 준비를 해주세요.", tag: "TOILET · GATE" },
  { stateKey: "doorsOpen", order: 8, title: "내 입구 찾기", message: "좌석 구역과 가장 가까운 입구, 반입 유의사항을 확인하세요.", tag: "GATE" },
  { stateKey: "onStage", order: 9, title: "동행자·만남", message: "동행자만의 시간을 추천합니다. 종료 30분 전엔 만날 장소를 정해두세요.", tag: "COMPANION · MEET" },
  { stateKey: "showEnded", order: 10, title: "귀가·VOICE", message: "막차·택시·주차장 출차·야식 정보를 확인하세요. 내일은 오늘 의견을 10초만 남겨주세요.", tag: "HOME · VOICE" },
];

export function getAlertIndex(stateKey: ArenaStateKey): number {
  return alertMoments.findIndex((m) => m.stateKey === stateKey);
}
