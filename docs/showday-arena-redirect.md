# SHOWDAY `/arena` → ARENA NOW 서브도메인 연결 예시

SHOWDAY 저장소의 `src/app/arena/page.tsx`를 아래와 같이 단순 redirect 페이지로 바꿀 수 있습니다.

```tsx
import { redirect } from "next/navigation";

export default function ArenaRedirectPage() {
  redirect("https://arena.showday.kr");
}
```

초기에는 바로 redirect하지 않고 안내 페이지 + 버튼으로 운영해도 됩니다.
ARENA NOW 서브도메인의 Vercel 배포와 DNS 연결이 완전히 끝난 뒤 적용하는 것을 권장합니다.
