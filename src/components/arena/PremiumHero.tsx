"use client";

import { useEffect, useState } from "react";
import { HeroCopy } from "@/lib/arena/heroCopy";

function Countdown({ target }: { target: Date }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <div className="h-12" />;
  const sec = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return (
    <div className="mt-4 flex items-end gap-5 tabular-nums">
      {[['HOURS', h], ['MINS', m], ['SECS', s]].map(([label, value]) => (
        <div key={label}>
          <div className="text-3xl font-black tracking-tight lg:text-4xl">{value}</div>
          <div className="mt-1 text-[9px] tracking-[.18em] text-white/50">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function PremiumHero({
  copy,
  accent,
  showStart,
}: {
  copy: HeroCopy;
  accent: string;
  showStart: Date;
}) {
  const dateLabel = showStart.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
  const timeLabel = showStart.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <section id="hero" className="mx-auto w-full max-w-[1600px] px-3 pt-3 sm:px-5 lg:px-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f] shadow-[0_28px_90px_rgba(0,0,0,.45)]">
        <div className="relative hidden h-[clamp(760px,52vw,940px)] md:block">
          <img src="/arena-main-bg.jpg" alt="ARENA NOW 아레나 컨셉 이미지" className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,20,.92)_0%,rgba(4,10,20,.58)_25%,rgba(4,10,20,.12)_55%,rgba(4,10,20,.34)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,.08)_0%,rgba(3,8,18,.02)_58%,rgba(3,8,18,.92)_100%)]" />

          <div className="absolute left-[4.5%] top-[12%] z-10 max-w-[510px]">
            <p className="text-[12px] font-bold tracking-[.28em] text-white/70">{copy.heroEyebrow}</p>
            <h1 className="mt-4 text-[clamp(48px,4.5vw,78px)] font-black leading-[1.03] tracking-[-.045em] text-white">
              <span className="block">{copy.heroTitle1}</span>
              <span className="block">{copy.heroTitle2.replace(/하루$/, "")}<em className="not-italic" style={{ color: accent }}>{copy.heroTitle2.endsWith("하루") ? "하루" : ""}</em></span>
            </h1>
            <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-white/78 lg:text-base">{copy.heroSub}</p>
            <a href="#show" className="mt-7 inline-flex min-w-56 items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-black text-white shadow-[0_12px_45px_rgba(55,110,255,.28)] transition-transform hover:-translate-y-0.5" style={{ background: `linear-gradient(90deg, ${accent}, #2bd5ff)` }}>
              {copy.heroCta} <span>→</span>
            </a>
          </div>

          <aside className="arena-live-card absolute right-[3.2%] top-[6%] z-20 w-[320px] rounded-[22px] border border-cyan-400/35 bg-[#061526]/92 p-5 shadow-[0_24px_80px_rgba(0,0,0,.45)] backdrop-blur-xl xl:w-[340px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-sm font-black"><span className="arena-pulse h-2.5 w-2.5 rounded-full bg-rose-500" /> NEXT SHOW</div>
              <span className="text-[10px] text-white/55">오늘의 공연</span>
            </div>
            <p className="mt-4 text-lg font-black">세븐틴 월드투어 [BE THE SUN]</p>
            <Countdown target={showStart} />
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[12px] text-white/72">
              <p>▣ {dateLabel} {timeLabel}</p>
              <p>● 서울아레나(창동) · DEMO</p>
            </div>
            <a href="#show" className="mt-4 flex items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-400/5 py-3 text-xs font-bold text-white hover:bg-cyan-400/10">공연 상세보기 →</a>
          </aside>

          {/* Background-image pins are visual-only. These invisible anchors make them real web controls. */}
          <a href="#park" aria-label="주차장 보기" className="absolute left-[31%] top-[15%] z-10 h-24 w-36 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/70" />
          <a href="#eat" aria-label="푸드존 보기" className="absolute left-[59%] top-[16%] z-10 h-24 w-36 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/70" />
          <a href="#transport" aria-label="창동역 및 교통 보기" className="absolute left-[18%] top-[45%] z-10 h-24 w-36 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/70" />
          <a href="#painpoints" aria-label="입장게이트 보기" className="absolute right-[20%] top-[31%] z-10 h-24 w-40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/70" />
          <a href="#toilet" aria-label="화장실 보기" className="absolute right-[14%] top-[53%] z-10 h-24 w-36 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/70" />

          <div className="absolute inset-x-[3%] bottom-5 z-20 grid grid-cols-6 gap-3">
            {[
              ["🚗", copy.navRoute, "대중교통·주차", "#transport"],
              ["🍴", copy.navFood, "공연 전후 맛집", "#eat"],
              ["🛍", copy.navService, "짐보관·편의시설", "#painpoints"],
              ["🤖", copy.navAi, "지금 필요한 정보", "#now-ai"],
              ["🎙", copy.liveLabel, "실시간 현장 소식", "#live-issues"],
              ["💗", copy.navMy, "나의 공연 일정", "#my-event"],
            ].map(([icon, title, sub, href]) => (
              <a key={title} href={href} className="group flex min-h-[86px] items-center gap-3 rounded-[18px] border border-cyan-300/18 bg-[#061321]/86 px-4 py-3 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-[#081b2e]/92">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-xl">{icon}</span>
                <span className="min-w-0"><strong className="block truncate text-sm text-white">{title}</strong><span className="mt-1 block truncate text-[10px] text-white/55">{sub}</span></span>
                <span className="ml-auto text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70">›</span>
              </a>
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src="/arena-main-bg.jpg" alt="ARENA NOW 아레나 컨셉 이미지" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06111e] via-transparent to-black/20" />
          </div>
          <div className="bg-[#06111e] px-5 pb-5 pt-2">
            <p className="text-[10px] font-bold tracking-[.22em] text-white/55">{copy.heroEyebrow}</p>
            <h1 className="mt-3 text-[36px] font-black leading-[1.08] tracking-[-.04em] text-white">{copy.heroTitle1}<br/><span style={{ color: accent }}>{copy.heroTitle2}</span></h1>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/68">{copy.heroSub}</p>
            <a href="#show" className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white" style={{ background: `linear-gradient(90deg, ${accent}, #2bd5ff)` }}>{copy.heroCta} →</a>
            <div className="mt-5 arena-live-card rounded-2xl border border-cyan-400/25 bg-[#07182a] p-4">
              <div className="flex items-center gap-2 text-xs font-black"><span className="arena-pulse h-2 w-2 rounded-full bg-rose-500" /> NEXT SHOW</div>
              <p className="mt-3 text-base font-black">세븐틴 월드투어 [BE THE SUN]</p>
              <Countdown target={showStart} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
