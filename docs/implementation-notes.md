# Implementation notes

## What this version does
- 3-second UI: the hero exposes at most four large QuickActions plus one CTA.
- Transport-aware prioritization: car / transit / taxi changes NOW AI recommendations
  (persisted to localStorage).
- Parking is prioritized 4–5 hours before showtime for car users.
- Time bands: D-1, 5H, 4H, 3H, 2H, 90M, 60M, doors, on-stage, ended (11 states).
- NOW AI is predictive-first rather than chat-first — currently rule-based
  (`src/lib/arena/predict.ts`), transparently labelled as such.
- SMART ALERT shows when the service should proactively notify the user, with the
  current moment highlighted against past/future ones.
- TOILET, ENTER, BAG, WEATHER, COMPANION TIME, MEET POINT, GO HOME and AROUND
  (situation/time filters including accessibility) are first-class friction areas.
- VOICE is a 10-second feedback prototype with age-band tagging; production should
  auto-fill age band from the SHOWDAY profile when permitted, not ask every time.
- FRICTION ZERO gives a one-screen summary of all pain points as a map/index into
  the detailed sections below it.

## Important production constraints
- Do not display minute-level wait times without real queue data.
- Do not continuously track location by default. Ask only when the user requests
  current-location routing.
- Live parking, traffic, weather, venue, gate and business-hour data require
  verified APIs or operator partnerships.
- Prototype/demo values must remain visibly labelled (DEMO badges) until real
  data is connected.

## LIVE ISSUE / LIVE NOW
- 실시간 관객 제보는 웹 화면에 즉시 노출하지만, 푸시는 긴급/중요 이슈에만 제한합니다.
- 등급: 긴급(즉시, 공식 출처 전용) · 중요(제보 10건 이상 누적 시 자동 승격,
  관련 사용자 1회) · 현장(화면 표시만) · 일반(VOICE 축적).
- 동일 카테고리 + 최근 30분 이내 제보는 하나로 병합하는 흐름을 시연합니다.
  운영 시에는 위치·시간·텍스트 유사도(임베딩)를 함께 사용해야 합니다.
- 공식 안내와 관람객 제보는 반드시 구분합니다("공식 안내 ✓" / "관람객 제보 👥").
  AI 요약은 관람객 제보를 공식 사실처럼 단정하지 않습니다.
- **다음 단계**: 최근 제보가 없거나 정상화되면 자동으로 하향/종료하는 TTL
  정책이 아직 없습니다(현재는 수동 상태만 존재). 실 서비스 전 추가 필요.
