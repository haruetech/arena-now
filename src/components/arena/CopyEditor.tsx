"use client";

import { useEffect, useState } from "react";
import { DEFAULT_HERO_COPY, HeroCopy, loadHeroCopy, saveHeroCopy, resetHeroCopy } from "@/lib/arena/heroCopy";

// 톱니바퀴 버튼 → 슬라이드 패널. 메뉴 라벨·핫스팟 라벨/설명을 코드 수정 없이
// 직접 바꿔볼 수 있습니다. localStorage에 저장되어 새로고침해도 유지됩니다.
export default function CopyEditor({ onChange }: { onChange: (copy: HeroCopy) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<HeroCopy>(DEFAULT_HERO_COPY);

  useEffect(() => {
    const loaded = loadHeroCopy();
    setDraft(loaded);
    onChange(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    saveHeroCopy(draft);
    onChange(draft);
    setOpen(false);
  };

  const reset = () => {
    resetHeroCopy();
    setDraft(DEFAULT_HERO_COPY);
    onChange(DEFAULT_HERO_COPY);
  };

  const field = (key: keyof HeroCopy, label: string) => (
    <label className="mb-2 grid grid-cols-[90px_1fr] items-center gap-2 text-xs">
      <span className="text-[var(--arena-muted)]">{label}</span>
      <input
        value={draft[key]}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        className="rounded-md border border-[var(--arena-border)] bg-transparent px-2 py-1.5 text-xs text-[var(--arena-text)]"
      />
    </label>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="메인 텍스트 편집"
        className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#111a2a] text-white shadow-lg sm:bottom-6"
      >
        ⚙
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55" onMouseDown={() => setOpen(false)}>
          <aside
            className="flex h-full w-full max-w-sm flex-col bg-[#0d1625] shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <strong className="block text-sm">메뉴·핫스팟 텍스트 편집</strong>
                <span className="mt-1 block text-[11px] text-[var(--arena-muted)]">
                  상태별 헤드라인은 제외, 고정 라벨만 편집합니다.
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="text-lg text-white">✕</button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <section className="mb-4 border-b border-white/10 pb-4">
                <h3 className="mb-2 text-xs font-bold">상단 메뉴</h3>
                {field("navShow", "공연정보")}
                {field("navRoute", "가는길")}
                {field("navFood", "주변맛집")}
                {field("navService", "현장서비스")}
                {field("navAi", "AI추천")}
                {field("navMy", "MY EVENT")}
                {field("liveLabel", "LIVE NOW")}
              </section>

              <section>
                <h3 className="mb-2 text-xs font-bold">조감도 핫스팟</h3>
                {field("pinShowLabel", "SHOW 라벨")}
                {field("pinShowDesc", "SHOW 설명")}
                {field("pinParkLabel", "PARK 라벨")}
                {field("pinParkDesc", "PARK 설명")}
                {field("pinEatLabel", "EAT 라벨")}
                {field("pinEatDesc", "EAT 설명")}
                {field("pinToiletLabel", "TOILET 라벨")}
                {field("pinToiletDesc", "TOILET 설명")}
                {field("pinCompanionLabel", "COMPANION 라벨")}
                {field("pinCompanionDesc", "COMPANION 설명")}
                {field("pinHomeLabel", "HOME 라벨")}
                {field("pinHomeDesc", "HOME 설명")}
              </section>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-4">
              <button onClick={reset} className="rounded-md border border-white/20 py-2.5 text-xs">
                초기화
              </button>
              <button onClick={save} className="rounded-md bg-[#2768ff] py-2.5 text-xs font-bold text-white">
                저장하기
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
