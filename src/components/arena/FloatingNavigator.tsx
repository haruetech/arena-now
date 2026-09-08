"use client";

import { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string; short: string; icon: string };
const ITEMS: NavItem[] = [
  { id: "show", label: "공연정보", short: "SHOW", icon: "🎟" },
  { id: "transport", label: "가는길", short: "ROUTE", icon: "🚗" },
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
    const onScroll = () => setVisible(window.scrollY > 650);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const elements = observedIds.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      const candidates = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (candidates[0]?.target.id) setActiveId(candidates[0].target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.01, 0.2, 0.5] });
    elements.forEach((el) => observer.observe(el)); return () => observer.disconnect();
  }, [observedIds]);

  if (!visible) return null;
  return (
    <>
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

      <nav className="fixed inset-x-3 bottom-3 z-[85] mx-auto max-w-md xl:hidden" aria-label="빠른 바로가기">
        {open && <div className="arena-glass-strong mb-2 grid grid-cols-4 gap-1 rounded-2xl p-2 shadow-2xl">{ITEMS.map((item) => <button key={item.id} onClick={() => { scrollToId(item.id); setOpen(false); }} className="rounded-xl px-1 py-2 text-center text-[10px]" style={activeId === item.id ? { background: `${accent}22`, color: accent } : undefined}><span className="block text-sm">{item.icon}</span><span className="mt-0.5 block">{item.short}</span></button>)}</div>}
        <div className="arena-glass-strong grid grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-2xl p-1.5 shadow-2xl"><button onClick={() => scrollToId("top")} className="rounded-xl px-2 py-2 text-[11px] font-bold">↑ 메인</button><button onClick={() => scrollToId("live-issues")} className="rounded-xl px-2 py-2 text-[11px] font-bold">● LIVE</button><button onClick={() => scrollToId("now-ai")} className="rounded-xl px-2 py-2 text-[11px] font-bold">✦ AI</button><button onClick={() => setOpen((v) => !v)} className="rounded-xl px-3 py-2 text-[11px] font-bold" style={{ background: open ? `${accent}25` : "rgba(255,255,255,.05)", color: open ? accent : "#fff" }}>{open ? "닫기" : "바로가기"}</button></div>
      </nav>
    </>
  );
}
