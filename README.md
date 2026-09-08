# ARENA NOW — Standalone Next.js Project

SHOWDAY 본체와 완전히 분리된 독립 저장소/배포입니다.
"THE SHOW STARTS BEFORE THE SHOW. / 공연은 입장 전에 이미 시작됩니다."

디자인 컨셉 프로토타입입니다 — 실제 서울아레나 제휴·개관 여부와 무관합니다.
전체 스펙은 `docs/arena-now-vision.md` 참고.

## 위치
- GitHub: `haruetech/arena-now`
- Vercel Project: `arena-now` (SHOWDAY와 별도 프로젝트)
- 권장 도메인: `arena.showday.kr`
- SHOWDAY 본체: `https://showday.kr`

`/`(루트) 자체가 ARENA NOW 메인입니다. `/arena` 라우트가 아닙니다.

## 핵심 원칙
**다른 서비스가 놓치는 공연 당일의 불편을 줄인다.**
**찾게 하지 않는다. 지금 필요한 것을 먼저 보여준다.**

공연정보 포털이 아니라, 공연 당일의 주차·화장실·입장·식사·짐·동행자·귀가·현장
이슈를 시간에 맞춰 해결하는 Event-Day OS를 목표로 합니다. 전체 UX 원칙과
시간 상태·NOW AI·LIVE ISSUE 설계는 `docs/arena-now-vision.md` 참고.

## 이번 병합에서 보강한 것
- **QuickActions·NOW AI 카드 실제 이동 복원**: 지금까지 바로가기 버튼들이 시각적으로만 존재하고 클릭해도 아무 데도 안 가는 상태였습니다. 각 버튼/카드가 실제 관련 섹션(`#park`, `#toilet`, `#live-issues` 등)으로 이동하도록 고쳤습니다.
- **VOICE INSIGHT 패널 추가**: 엑셀 기획의 "관리자 분석 화면"(예: 50대가 불편해하는 것) 개념을 실제 구현했습니다. 게시판은 하나로 유지하면서, 연령대별 집계를 작은 패널로 보여줍니다.
- **LIVE ISSUE 연령대 내부 집계**: 제보에 연령대 태그(`ageBreakdown`)를 붙이되, 공개 카드에는 노출하지 않고 내부 분석용으로만 씁니다.
- **연령대 선택 기억**: LIVE ISSUE·VOICE 작성 시 고른 연령대를 localStorage에 저장해 반복 입력을 줄였습니다 (운영에서는 카카오 프로필로 완전히 대체).
- **"보고 싶은 공연" 반응 문구 자동 전환**: 이 카테고리만 "나도 보고 싶어요"로 바뀝니다.
- **접근성**: QuickActions·PredictiveAI 카드에 포커스 링 추가.

## 로컬 실행
```bash
npm install
npm run dev
```
`http://localhost:3000`에서 확인합니다.

## 포지셔닝
공연정보 사이트가 아니라, **공연 당일 실제 불편을 줄이는 Event-Day OS**입니다.
(기준: `ARENA_NOW_공연당일_문제해결_기획정리_최종확장본.xlsx`)

## 핵심 구조
- `src/lib/arena/states.ts` — **11단계**로 세분화한 상태(D-N → TOMORROW →
  5H → 4H → 3H → 2H → 90M → 60M → DOORS OPEN → ON STAGE → SHOW ENDED)별
  색·헤드라인·CTA. 시간이 흐를수록 파랑(여유)→주황(준비)→빨강(60분 전,
  긴급)→초록(입장)→보라(공연 중)→회색(종료)으로 색 자체가 긴급도를 표현
- `src/lib/arena/schedule.ts` — 공연 시작/종료시간 기준 11단계 자동 계산
- `src/lib/arena/predict.ts` + `TransportSelector.tsx` + `PredictiveAI.tsx`
  — **NOW AI**: 지금 상태 + 이동수단(자가용/대중교통/택시)을 함께 보고
  다음 행동 3가지를 추천. 이동수단 선택은 localStorage에 저장되어 다음
  방문 때도 유지됩니다
- `src/components/arena/QuickActions.tsx` — 상태별로 바뀌는 4개 바로가기
- `src/lib/arena/alerts.ts` + `SmartAlertFeed.tsx` — SMART ALERT: 11단계에
  맞춘 예방형 알림 타임라인. 지나온 알림은 체크, 지금 알림은 강조, 다가올
  알림은 미리보기로 흐리게 표시
- `src/lib/arena/liveIssues.ts` — **LIVE ISSUE**: VOICE(⚪ 일반 의견)와
  분리된 실시간 현장 제보. 🔴 긴급(공식 출처 전용) / 🟠 중요(제보 10건
  이상 누적 시 자동 승격, 조건부 1회 알림) / 🟡 현장(표시만, 알림 없음)
  4단계 정책. 같은 카테고리의 최근 제보는 하나의 이슈로 병합하고,
  "공식 안내 ✓" / "관람객 제보 👥"를 절대 섞지 않음
- `src/components/arena/LiveNowWidget.tsx` / `LiveIssueBoard.tsx` /
  `ReportComposer.tsx` — 항상 보이는 LIVE NOW 위젯 + 등급 정책 표 +
  3단계 제보 작성(카테고리 → 한 줄 → 등록, 연령대는 참고용 데모 필드)
- `src/components/arena/FrictionZeroSection.tsx` — PARK/TOILET/ENTER/BAG/
  WEATHER/GO HOME을 한눈에 보는 요약 그리드
- `src/components/arena/ArenaSkyline.tsx` — 미래형 아레나 컨셉 일러스트 +
  6개 Hotspot (SHOW/PARK/EAT/TOILET/COMPANION/HOME)
- `ParkSection.tsx` / `EatArenaZoneSection.tsx` / `ToiletNowSection.tsx` /
  `AroundChips.tsx`(상황 기반: NOW OPEN·120 MIN·90 MIN·10 MIN WALK·
  AFTER 10PM·ACCESSIBLE) / `CompanionTimeSection.tsx`(90/120/180분 코스
  선택 + 예시 타임라인) / `GoHomeSection.tsx`(귀가 + MEET POINT)
- `VoiceBoard.tsx` — LIVE ISSUE와 분리된 ⚪ 일반 의견. 카테고리 선택 +
  연령대(데모, 운영 시 프로필 자동 연결) + 한 줄 작성 폼 + "나도 그래요"
  반응이 있는 기존 의견 피드
- `ShowDayTimeline.tsx` — MY SHOW DAY 타임라인
- 화면의 "자동 계산 / 데모로 미리보기" 토글, `.arena-scope` 클래스로
  테마 스코프 처리 + `prefers-reduced-motion` 접근성 대응

## 다음 단계 (엑셀 기획 기준)
- LIVE ISSUE 병합 로직은 지금은 "같은 카테고리 + 최근 30분"이라는 단순 규칙입니다.
  실제로는 "2번 게이트"와 "B게이트"처럼 다른 표현도 묶어야 하므로, 문장
  임베딩 유사도 기반 매칭(LLM 분류 또는 클러스터링)으로 교체가 필요합니다.
- 2차: BAG(짐보관), MEET POINT 실제 위치 공유 기능 고도화
- 3차: 실시간 혼잡/주차 (센서·운영사 API 연동 필요)
- VOICE 데이터는 연령대(카카오 로그인 프로필 1회 수집) + 관람 여부 +
  동행 형태로 자동 분류·집계하는 관리자 대시보드로 확장 예정

## Vercel 배포
1. GitHub `haruetech/arena-now` 저장소에 이 프로젝트 내용물을 push
2. Vercel → New Project → `haruetech/arena-now` Import
   (Framework: Next.js, Root Directory: `./`)
3. Deploy
4. 배포된 프로젝트 → Settings → Domains → `arena.showday.kr` 추가
5. Vercel이 안내하는 CNAME 값(보통 `cname.vercel-dns.com`)을 showday.kr을
   관리하는 DNS에 서브도메인 `arena` 레코드로 등록
6. DNS 전파 후 "Valid Configuration"으로 뜨면 완료

## SHOWDAY 쪽 연결
- 코드/저장소/배포가 완전히 분리되어 있습니다. SHOWDAY 쪽 `showday` 저장소의
  `/arena` 경로는 이 앱(`arena.showday.kr`)으로 안내만 합니다.
- 배포가 안정화되면 안내 페이지 대신 바로 redirect로 바꿀 수 있습니다.
  예시는 `docs/showday-arena-redirect.md` 참고.
- 디자인 방향이 바뀌면 이 저장소만 수정하면 되고, SHOWDAY 본체 코드에는
  영향이 없습니다.

## 2026-09-08 targeted UX refinement
- First visit no longer assumes car; transport is chosen once and remembered.
- NOW AI shows a short reason for each recommendation ("왜? 자가용 · 공연 3시간 전 기준 추천").
- Crowd LIVE ISSUE cards expire when stale (`isIssueFresh`); official notices remain.
- Critical severity is reserved for truly urgent operational/safety changes; demo baggage rule downgraded from critical to important.
- MY EVENT summary card added; mobile bottom quick navigation added.
- Long secondary services collapsed under "전체 서비스 보기": FRICTION ZERO 요약, MY SHOW DAY 예시, AROUND, COMPANION TIME.
- **EAT/ARENA ZONE은 접힘 영역이 아니라 PARK·TOILET·GO HOME과 함께 항상 노출됩니다** — 엑셀 원본(`ARENA_NOW_공연당일_문제해결_기획정리`)에서 "공연 전 먹거리"가 주차·화장실·귀가와 동일한 핵심(우선순위 최상위) 항목으로 분류되어 있어, 접힘 영역에 두면 우선순위 분류와 어긋납니다.

## 2026-09-08 이미지 저작권 확인 결과
서울아레나 실제 조감도(서울시 미디어허브, 서울균형발전포털 게재본)를 확인했으나
모두 **공공누리 제4유형(출처표시+상업적 이용금지+변경금지)** 라이선스입니다.
- 상업적 이용 금지 → SHOWDAY/ARENA NOW는 사업의 일부라 해당 조건에 걸림
- 변경 금지 → 이미지 위에 상태·헤드라인·LIVE NOW를 오버레이하는 지금 구조 자체가 위반

따라서 지금처럼 저작권 문제 없는 추상 일러스트를 계속 쓰고, 대신 다층 조명·
구조 디테일(돔 내부 광원, 이중 헤일로 링, 관람객 불빛, 비네트)을 추가해
완성도를 높였습니다. 실제 이미지가 필요하면 ㈜서울아레나(카카오) 또는
서울시에 별도로 상업적 이용·변경 허락을 문의해야 합니다.

## 2026-09-08 상단 네비게이션 추가
참고 이미지의 텍스트가 AI 이미지 생성 특유의 깨짐 현상으로 확인되어,
실제 이미지 사용은 계속 보류합니다(저작권 문제 + 텍스트 편집 불가 이중 이유).
대신 참고 이미지의 메뉴 구성을 실제 텍스트(HTML)로 구현했습니다.

- 데스크톱에서만 보이는 상단 메뉴 6개: 공연정보(`#show`) · 가는길(`#transport`) ·
  주변맛집(`#eat`) · 현장서비스(`#painpoints`) · AI추천(`#now-ai`) · MY EVENT(`#my-event`)
- 모바일에서는 기존 하단 빠른 메뉴(NOW/LIVE/PARK/VOICE)가 같은 역할을 합니다.

## 2026-09-08 히어로 겹침 버그 수정 (긴급)
스크린샷으로 확인된 실제 버그: 헤드라인 텍스트 위에 핫스팟 핀(HOME, COMPANION 등)이
그대로 겹쳐 글자가 안 보이는 상태였습니다. 원인은 이미지 위 오버레이에 너무 많은
텍스트(배지·헤드라인·서브텍스트·TODAY 카드·LIVE NOW 목록)를 쌓으면서, 핀 좌표와
텍스트 영역이 서로 침범한 것입니다.

**수정**: 이미지(`ArenaSkyline`) 위에는 CONCEPT PROTOTYPE 태그와 핀만 남기고,
헤드라인·배지·TODAY SHOW·LIVE NOW·MY EVENT는 전부 이미지 밖 별도 영역으로
분리했습니다. 겹침이 구조적으로 불가능해졌습니다. 이미지 비율도 텍스트 공간이
더 이상 필요 없어져 다시 가로형(4:3 모바일 / 16:9 데스크톱)으로 줄였습니다.

또한 QuickActions를 아이콘 원 + 라벨 + 화살표(›)가 있는 명확한 버튼 카드로
바꿔서 "무엇을 클릭할 수 있는지" 한눈에 보이게 했습니다.

## 2026-09-08 데스크톱 와이드 히어로 (모바일은 안전 구조 유지)
참고 이미지처럼 데스크톱에서는 이미지를 더 넓게 쓰고, 왼쪽엔 헤드라인,
오른쪽 위엔 TODAY SHOW 카드를 이미지 위에 얹었습니다. 핀은 오른쪽 구역
(x 48~90%)에만 배치되어 왼쪽 텍스트와 절대 겹치지 않습니다. 이미지에
좌→우 스크림을 추가해 왼쪽 텍스트 가독성을 확보했습니다.

**모바일은 지난번 수정한 안전한 구조를 그대로 유지합니다** — 이미지엔
태그+핀만, 헤드라인·TODAY SHOW·LIVE NOW는 이미지 밖 별도 카드로.
(`sm:hidden` / `hidden sm:block`으로 반응형 전환)

또한 참고 이미지의 6개 카테고리 버튼(가는길·주변맛집·현장서비스·AI추천·
LIVE NOW·MY EVENT)을 상태와 무관하게 항상 고정으로 추가했습니다.
모바일에서는 상단 네비게이션이 안 보이므로 이 카드들이 그 역할을 대신합니다.

## 2026-09-08 편집 가능한 텍스트 시스템 추가
업로드해주신 "EditableArenaHero" 패턴에서 톱니바퀴 편집 패널 아이디어를
채택했습니다. 다만 함께 온 배경 이미지(`arena-hero-concept.jpg`)는 여전히
"창동역" 등 실제 지명과 실제 서울아레나 설계를 사실적으로 재현하고 있어
(건물명만 "SEOUL CULTURE ARENA"로 바뀜) 프로젝트에 포함하지 않았습니다.
이름을 바꾼다고 저작권·상표권 문제가 해소되지 않습니다.

- `src/lib/arena/heroCopy.ts` — 상단 메뉴 라벨, LIVE NOW 라벨, 조감도
  핫스팟 라벨/설명 등 **상태와 무관한 고정 텍스트**의 편집 가능한 데이터.
  localStorage에 저장되어 새로고침해도 유지됩니다.
- `src/components/arena/CopyEditor.tsx` — 화면 우측 하단 톱니바퀴 버튼 →
  슬라이드 패널. 코드 수정 없이 메뉴·핫스팟 텍스트를 직접 바꿔볼 수 있습니다.
- 상태별로 자동 전환되는 헤드라인·배지(`states.ts`)는 상태머신의 핵심이라
  이 편집 대상에 포함하지 않았습니다 — 편집하면 11단계 전환 로직과
  충돌하기 때문입니다.

## 2026-09-08 남은 참고 요소 전부 반영
- `WeatherWidget.tsx` — 상단바 날씨 위젯 (데스크톱 lg 이상에서만 노출, 예시값·DEMO)
- `TodayShowCard`에 "상세보기 →" / "공유하기" 버튼 추가. 공유는 Web Share API,
  미지원 브라우저에서는 클립보드 복사로 폴백
- `AiRecommendCard.tsx` — 로봇 이모지 + 그라데이션 카드 + 추천 칩(주차 정보·
  맛집 추천·짐보관·귀가 교통), TODAY/LIVE NOW와 나란히 2단 그리드
- `PromoBanner.tsx` — 하단 프로모션 배너 + 4개 아이콘 칩(맛집·카페/짐보관
  서비스/귀가 교통/이벤트·기념품)
- `SiteFooter.tsx` — 브랜드, 약관·고객센터 링크, SNS, 저작권, "Your Stage,
  Our Day" 태그라인
- 모바일 전용 햄버거 메뉴 — 상단 네비가 숨는 모바일 화면에서 ☰ 버튼으로
  6개 메뉴를 드롭다운으로 열어볼 수 있음 (heroCopy 라벨과 연동)
