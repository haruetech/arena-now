"use client";

import { useEffect, useMemo, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  short: string;
  icon: string;
};

const ITEMS: NavItem[] = [
  { id: "now-ai", label: "AI 추천", short: "NOW", icon: "✦" },
  { id: "live-issues", label: "LIVE NOW", short: "LIVE", icon: "●" },
  { id: "park", label: "주차", short: "PARK", icon: "P" },
  { id: "toilet", label: "화장실", short: "WC", icon: "⌁" },
  { id: "eat", label: "먹거리", short: "EAT", icon: "⌂" },
  { id: "after", label: "귀가", short: "HOME", icon: "↗" },
  { id: "voice", label: "VOICE", short: "VOICE", icon: "◉" },
];

function scrollToId(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function FloatingNavigator({ accent }: { accent: string }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("now-ai");

  const observedIds = useMemo(() => ITEMS.map((item) => item.id), []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (candidates[0]?.target.id) setActiveId(candidates[0].target.id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.01, 0.15, 0.4] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [observedIds]);

  if (!visible) return null;

  return (
    <>
      {/* Desktop: page context follows the user without covering content. */}
      <aside
        className="fixed right-5 top-1/2 z-[70] hidden -translate-y-1/2 lg:flex lg:flex-col lg:items-end lg:gap-2"
        aria-label="현재 페이지 바로가기"
      >
        <button
          onClick={() => scrollToId("top")}
          className="arena-follow-item group flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-bold"
          title="메인으로"
        >
          <span className="arena-follow-dot">↑</span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-24 group-hover:opacity-100">메인으로</span>
        </button>

        <div className="arena-follow-rail arena-glass-strong rounded-[22px] p-1.5 shadow-2xl">
          {ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className="group flex w-full items-center justify-end gap-2 rounded-2xl px-2 py-2 text-[10px] transition-all"
                style={{ background: active ? `${accent}20` : "transparent", color: active ? "#fff" : "var(--arena-muted)" }}
                title={item.label}
              >
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-28 group-hover:opacity-100">
                  {item.label}
                </span>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold"
                  style={{
                    borderColor: active ? `${accent}99` : "rgba(255,255,255,.12)",
                    background: active ? `${accent}28` : "rgba(255,255,255,.04)",
                    color: active ? accent : "#fff",
                  }}
                >
                  {item.icon}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile/tablet: compact dock. Menu expands upward, keeping a permanent Home action. */}
      <nav className="arena-mobile-follow fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md lg:hidden" aria-label="빠른 바로가기">
        {open && (
          <div className="arena-glass-strong mb-2 grid grid-cols-4 gap-1 rounded-2xl p-2 shadow-2xl">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToId(item.id);
                  setOpen(false);
                }}
                className="rounded-xl px-1 py-2 text-center text-[10px]"
                style={activeId === item.id ? { background: `${accent}22`, color: accent } : undefined}
              >
                <span className="block text-sm">{item.icon}</span>
                <span className="mt-0.5 block">{item.short}</span>
              </button>
            ))}
          </div>
        )}
        <div className="arena-glass-strong grid grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-2xl p-1.5 shadow-2xl">
          <button onClick={() => scrollToId("top")} className="rounded-xl px-2 py-2 text-[11px] font-bold">↑ 메인</button>
          <button onClick={() => scrollToId("live-issues")} className="rounded-xl px-2 py-2 text-[11px] font-bold">● LIVE</button>
          <button onClick={() => scrollToId("now-ai")} className="rounded-xl px-2 py-2 text-[11px] font-bold">✦ NOW</button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl px-3 py-2 text-[11px] font-bold"
            style={{ background: open ? `${accent}25` : "rgba(255,255,255,.05)", color: open ? accent : "#fff" }}
            aria-expanded={open}
          >
            {open ? "닫기" : "바로가기"}
          </button>
        </div>
      </nav>
    </>
  );
}
