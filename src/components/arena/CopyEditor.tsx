"use client";

import { useEffect, useState } from "react";
import { DEFAULT_HERO_COPY, HeroCopy, loadHeroCopy, saveHeroCopy, resetHeroCopy } from "@/lib/arena/heroCopy";

export default function CopyEditor({ onChange }: { onChange: (copy: HeroCopy) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<HeroCopy>(DEFAULT_HERO_COPY);

  useEffect(() => {
    const loaded = loadHeroCopy();
    setDraft(loaded);
    onChange(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => { saveHeroCopy(draft); onChange(draft); setOpen(false); };
  const reset = () => { resetHeroCopy(); setDraft(DEFAULT_HERO_COPY); onChange(DEFAULT_HERO_COPY); };
  const field = (key: keyof HeroCopy, label: string, multiline = false) => (
    <label className="mb-2 grid grid-cols-[92px_1fr] items-start gap-2 text-xs">
      <span className="pt-2 text-[var(--arena-muted)]">{label}</span>
      {multiline ? (
        <textarea rows={3} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} className="rounded-md border border-[var(--arena-border)] bg-transparent px-2 py-1.5 text-xs text-[var(--arena-text)]" />
      ) : (
        <input value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} className="rounded-md border border-[var(--arena-border)] bg-transparent px-2 py-1.5 text-xs text-[var(--arena-text)]" />
      )}
    </label>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="메인 텍스트 편집" className="fixed bottom-20 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#111a2a] text-white shadow-lg sm:bottom-6">⚙</button>
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/55" onMouseDown={() => setOpen(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-[#0d1625] shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div><strong className="block text-sm">메인 화면 텍스트 설정</strong><span className="mt-1 block text-[11px] text-[var(--arena-muted)]">코드 수정 없이 문구를 바꿀 수 있습니다.</span></div>
              <button onClick={() => setOpen(false)} className="text-lg text-white">✕</button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <section className="mb-5 border-b border-white/10 pb-4">
                <h3 className="mb-3 text-xs font-bold">히어로 문구</h3>
                {field("heroEyebrow", "영문 카피")}
                {field("heroTitle1", "제목 1줄")}
                {field("heroTitle2", "제목 2줄")}
                {field("heroSub", "설명", true)}
                {field("heroCta", "버튼")}
                {field("footerTagline", "하단 슬로건")}
              </section>
              <section className="mb-5 border-b border-white/10 pb-4">
                <h3 className="mb-3 text-xs font-bold">상단 메뉴</h3>
                {field("navShow", "공연정보")}{field("navRoute", "가는길")}{field("navFood", "주변맛집")}{field("navService", "현장서비스")}{field("navAi", "AI 추천")}{field("navMy", "MY EVENT")}{field("liveLabel", "LIVE NOW")}
              </section>
              <section>
                <h3 className="mb-3 text-xs font-bold">핫스팟 라벨</h3>
                {field("pinParkLabel", "PARK")}{field("pinEatLabel", "EAT")}{field("pinToiletLabel", "TOILET")}{field("pinCompanionLabel", "COMPANION")}{field("pinHomeLabel", "HOME")}
              </section>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-4"><button onClick={reset} className="rounded-md border border-white/20 py-2.5 text-xs">초기화</button><button onClick={save} className="rounded-md bg-[#2768ff] py-2.5 text-xs font-bold text-white">저장하기</button></div>
          </aside>
        </div>
      )}
    </>
  );
}
