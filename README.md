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

## 로컬 실행
```bash
npm install
npm run dev
```
`http://localhost:3000`에서 확인합니다.

## 핵심 구조
- `src/lib/arena/states.ts` — 7단계 상태(D-N → TOMORROW → LIVE DAY →
  3 HOURS TO SHOW → DOORS OPEN → ON STAGE → SHOW ENDED)별 색·헤드라인·CTA 정의
- `src/lib/arena/schedule.ts` — **공연 시작/종료시간 기준 자동 상태 계산**.
  실 데이터 연결 시 `getExampleSchedule` 대신 실제 공연 시작·종료시간만
  넘기면 자동으로 전환됩니다.
- `src/components/arena/ArenaSkyline.tsx` — 미래형 아레나 컨셉 일러스트
  (서울아레나를 그대로 재현하지 않은 추상 SVG) + 클릭형 Hotspot
  (SHOW/EAT/3 HOURS/AROUND/AFTER)
- `src/components/arena/ShowDayTimeline.tsx` — MY SHOW DAY 타임라인
- `src/components/arena/ThreeHoursTeaser.tsx` — 부모 3시간 프로그램
- `src/components/arena/AroundChips.tsx` — 상황 기반 AROUND (NOW OPEN,
  60 MINUTES, AFTER 10PM 등)
- 화면의 "자동 계산 / 데모로 미리보기" 토글로 실시간 계산 결과와
  제안·시연용 수동 전환기를 오갈 수 있음
- AFTER SHOW 카드는 실 데이터 연동 전임을 나타내는 "DEMO" 배지 표시
- `.arena-scope` 클래스로 테마를 스코프 처리 (전역 오염 방지) +
  `prefers-reduced-motion` 접근성 대응

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
