"use client";

import { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string; short: string; icon: string };
const ITEMS: NavItem[] = [
  { id: "show", label: "공연정보", short: "SHOW", icon: "🎟" },
  { id: "transport", label: "가는길", short: "ROUTE", icon: "📍" },
  { id: "eat", label: "주변맛집", short: "EAT", icon: "🍴" },
  { id: "painpoints", label: "현장서비스", short: "SERVICE", icon: "🛍" },
  { id: "now-ai", label: "AI 추천", short: "AI", icon: "🤖" },
  { id: "live-issues", label: "LIVE NOW", short: "LIVE", icon: "🎙" },
  { id: "my-event", label: "MY EVENT", short: "MY", icon: "💗" },
];

function scrollToId(id: string) {
  if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function FloatingNavigator({ accent }: { accent: string }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("show");
  const observedIds = useMemo(() => ITEMS.map((item) => item.id), []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const elements = observedIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      const candidates = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (candidates[0]?.target.id) setActiveId(candidates[0].target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0.01, 0.2, 0.5] });
    elements.forEach((el) => observer.observe(el)); return () => observer.disconnect();
  }, [observedIds]);

  return (
    <>
      {visible && (
        <aside className="fixed right-4 top-1/2 z-[85] hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:gap-2" aria-label="페이지 바로가기">
          <div className="arena-glass-strong rounded-[26px] p-1.5 shadow-2xl">
            <button onClick={() => scrollToId("top")} className="group flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-[10px] text-white/70"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[.04]">⌂</span><span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all group-hover:max-w-24 group-hover:opacity-100">메인으로</span></button>
            {ITEMS.map((item) => {
              const active = activeId === item.id;
              return <button key={item.id} onClick={() => scrollToId(item.id)} className="group flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-[10px]" style={{ background: active ? `${accent}22` : "transparent", color: active ? "#fff" : "var(--arena-muted)" }}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm" style={{ borderColor: active ? `${accent}88` : "rgba(255,255,255,.1)", background: active ? `${accent}25` : "rgba(255,255,255,.03)" }}>{item.icon}</span><span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all group-hover:max-w-28 group-hover:opacity-100">{item.label}</span></button>;
            })}
          </div>
          <button onClick={() => scrollToId("top")} className="flex h-12 w-12 flex-col items-center justify-center rounded-full border border-cyan-300/25 bg-[#07182a]/95 text-[9px] font-bold shadow-xl">↑<span>TOP</span></button>
        </aside>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[90] border-t border-cyan-300/15 bg-[#04101d]/96 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-16px_44px_rgba(0,0,0,.45)] backdrop-blur-xl lg:hidden" aria-label="모바일 하단 메뉴">
        {open && (
          <div className="mx-auto mb-2 grid max-w-md grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-[#07182a] p-2 shadow-2xl">
            {ITEMS.filter(i => !["show","transport","now-ai","my-event"].includes(i.id)).map((item) => (
              <button key={item.id} onClick={() => { scrollToId(item.id); setOpen(false); }} className="rounded-xl px-1 py-2 text-center text-[10px]" style={activeId === item.id ? { background: `${accent}22`, color: accent } : undefined}><span className="block text-sm">{item.icon}</span><span className="mt-0.5 block">{item.short}</span></button>
            ))}
          </div>
        )}
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {[
            ["top","홈","⌂"],
            ["show","공연정보","🎟"],
            ["transport","지도","📍"],
            ["now-ai","AI 추천","🤖"],
            ["my-event","MY","♡"],
          ].map(([id,label,icon]) => (
            <button key={id} onClick={() => scrollToId(id)} className="flex min-h-[52px] flex-col items-center justify-center rounded-xl px-1 text-[10px] font-bold" style={activeId === id ? { color: accent, background: `${accent}16` } : { color: "rgba(255,255,255,.72)" }}>
              <span className="text-base">{icon}</span><span className="mt-0.5">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setOpen(v => !v)} aria-label="더보기" className="absolute right-2 top-[-44px] flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/20 bg-[#07182a] text-xs text-white shadow-lg">{open ? "×" : "＋"}</button>
      </nav>
    </>
  );
}
