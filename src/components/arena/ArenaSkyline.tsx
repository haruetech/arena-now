"use client";

import { useState } from "react";
import { DEFAULT_HERO_COPY, HeroCopy } from "@/lib/arena/heroCopy";

// 서울아레나를 그대로 복제하지 않은, 미래형 K-POP 아레나 컨셉 일러스트입니다.
// (docs/arena-now-vision.md 참고 — 운영 단계에서는 사용 허가 이미지로 교체)

interface Hotspot {
  id: string;
  icon: string;
  label: string;
  desc: string;
  color: string;
  x: number; // %
  y: number; // %
  href: string;
}

function buildHotspots(copy: HeroCopy): Hotspot[] {
  return [
    { id: "show", icon: "🎤", label: copy.pinShowLabel, desc: copy.pinShowDesc, color: "#a78bfa", x: 62, y: 26, href: "#show" },
    { id: "park", icon: "🅿️", label: copy.pinParkLabel, desc: copy.pinParkDesc, color: "#818cf8", x: 48, y: 50, href: "#park" },
    { id: "eat", icon: "🍴", label: copy.pinEatLabel, desc: copy.pinEatDesc, color: "#34d399", x: 80, y: 44, href: "#eat" },
    { id: "toilet", icon: "🚻", label: copy.pinToiletLabel, desc: copy.pinToiletDesc, color: "#60a5fa", x: 90, y: 64, href: "#toilet" },
    { id: "companion", icon: "👥", label: copy.pinCompanionLabel, desc: copy.pinCompanionDesc, color: "#f472b6", x: 68, y: 78, href: "#companion" },
    { id: "home", icon: "🚕", label: copy.pinHomeLabel, desc: copy.pinHomeDesc, color: "#fbbf24", x: 52, y: 78, href: "#after" },
  ];
}

export default function ArenaSkyline({
  accent,
  overlay,
  heroCopy = DEFAULT_HERO_COPY,
}: {
  accent: string;
  overlay?: React.ReactNode;
  heroCopy?: HeroCopy;
}) {
  const [active, setActive] = useState<string | null>(null);
  const hotspots = buildHotspots(heroCopy);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--arena-border)] sm:aspect-[16/9]">
      <svg
        viewBox="0 0 400 250"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05040c" />
            <stop offset="55%" stopColor="#0c0a1c" />
            <stop offset="100%" stopColor="#181229" />
          </linearGradient>
          <radialGradient id="horizonGlow" cx="50%" cy="82%" r="45%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="domeGlowOuter" cx="50%" cy="52%" r="65%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="domeGlowCore" cx="50%" cy="80%" r="30%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="domeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#211c38" />
            <stop offset="55%" stopColor="#161029" />
            <stop offset="100%" stopColor="#0a0816" />
          </linearGradient>
          <linearGradient id="domeInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vignette" cx="50%" cy="42%" r="75%">
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        <rect width="400" height="250" fill="url(#sky)" />
        <rect width="400" height="250" fill="url(#horizonGlow)" />

        {/* 별 — 크기·밝기 편차를 키워 입체감 */}
        {[...Array(55)].map((_, i) => (
          <circle
            key={i}
            cx={(i * 27 + (i % 3) * 11) % 400}
            cy={(i * 41) % 115}
            r={i % 9 === 0 ? 1.6 : i % 4 === 0 ? 1.0 : 0.5}
            fill="#ffffff"
            opacity={0.2 + (i % 6) * 0.12}
          />
        ))}

        {/* 도시 실루엣 — 앞뒤 레이어로 원근감 */}
        <g fill="#0a0814" opacity="0.9">
          <rect x="0" y="182" width="32" height="68" />
          <rect x="365" y="178" width="35" height="72" />
        </g>
        <g fill="#120f20">
          <rect x="34" y="160" width="24" height="90" />
          <rect x="340" y="150" width="28" height="100" />
          <rect x="60" y="172" width="16" height="78" />
        </g>

        {/* 아레나 후광 (2단계 — 넓은 앰비언트 + 하단 코어) */}
        <ellipse cx="200" cy="140" rx="175" ry="105" fill="url(#domeGlowOuter)" />
        <ellipse cx="200" cy="205" rx="90" ry="30" fill="url(#domeGlowCore)" />

        {/* 빛줄기 */}
        <g opacity="0.45">
          {[-70, -42, -14, 14, 42, 70].map((angle, i) => (
            <line
              key={i}
              x1="200"
              y1="118"
              x2={200 + Math.sin((angle * Math.PI) / 180) * 150}
              y2={118 - Math.cos((angle * Math.PI) / 180) * 150}
              stroke={accent}
              strokeWidth={i % 2 === 0 ? "1.4" : "0.7"}
              strokeOpacity={0.32 - i * 0.02}
            />
          ))}
        </g>

        {/* 플로팅 지지 구조물 */}
        <g stroke={accent} strokeOpacity="0.35" strokeWidth="1">
          <line x1="128" y1="202" x2="150" y2="218" />
          <line x1="272" y1="202" x2="250" y2="218" />
          <circle cx="150" cy="218" r="1.6" fill={accent} fillOpacity="0.6" />
          <circle cx="250" cy="218" r="1.6" fill={accent} fillOpacity="0.6" />
        </g>

        {/* 아레나 돔 본체 */}
        <path
          d="M 82 208 Q 82 98 200 90 Q 318 98 318 208 Z"
          fill="url(#domeBody)"
          stroke={accent}
          strokeOpacity="0.75"
          strokeWidth="1.5"
        />
        {/* 돔 하단 내부 광원 (창문에서 새어나오는 느낌) */}
        <path d="M 82 208 Q 82 150 200 145 Q 318 150 318 208 Z" fill="url(#domeInner)" />

        {/* 미디어 파사드 격자 — 세로 리브 + 곡선 밴드 */}
        <g stroke={accent} strokeOpacity="0.25" strokeWidth="0.6">
          {[...Array(11)].map((_, i) => {
            const x = 95 + i * 21;
            return <line key={i} x1={x} y1="207" x2={200} y2="92" />;
          })}
        </g>
        <g stroke={accent} strokeOpacity="0.3" strokeWidth="0.7" fill="none">
          {[128, 148, 168, 188, 202].map((y, i) => (
            <path key={i} d={`M ${88 + i * 2.5} ${y} Q 200 ${y - 12} ${312 - i * 2.5} ${y}`} />
          ))}
        </g>

        {/* 돔 상단 헤일로 (이중 링) */}
        <ellipse cx="200" cy="90" rx="58" ry="8.5" fill="none" stroke={accent} strokeWidth="1.6" strokeOpacity="0.85" />
        <ellipse cx="200" cy="90" rx="70" ry="11" fill="none" stroke={accent} strokeWidth="0.7" strokeOpacity="0.35" />

        {/* 바닥 반사 + 관람객 불빛 (스케일감) */}
        <ellipse cx="200" cy="214" rx="135" ry="15" fill="url(#ground)" />
        {[...Array(14)].map((_, i) => (
          <circle
            key={i}
            cx={110 + i * 13 + (i % 2) * 4}
            cy={216 + (i % 3)}
            r={0.9}
            fill={i % 3 === 0 ? accent : "#ffffff"}
            opacity={0.35 + (i % 4) * 0.12}
          />
        ))}

        {/* 비네트 — 시네마틱 프레이밍 */}
        <rect width="400" height="250" fill="url(#vignette)" />
      </svg>

      {/* 하단 스크림 — 텍스트 오버레이 가독성 확보 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(5,6,10,0.92) 0%, rgba(5,6,10,0.35) 45%, transparent 75%)" }}
      />
      {/* 좌측 스크림 — 데스크톱 헤드라인 구역 가독성 확보 (모바일에선 헤드라인이 이미지 밖에 있어 무해) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(5,6,10,0.85) 0%, rgba(5,6,10,0.25) 42%, transparent 62%)" }}
      />

      {/* Hotspots — 핀 + 아이콘 + 라벨을 항상 보여주고, 클릭하면 설명이 펼쳐집니다 */}
      {hotspots.map((h) => (
        <div
          key={h.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <button onClick={() => setActive(active === h.id ? null : h.id)} className="flex flex-col items-center">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs shadow-lg ring-2 ring-black/30"
              style={{ background: h.color }}
            >
              {h.icon}
            </span>
            <span
              className="-mt-0.5 h-2 w-2 rotate-45"
              style={{ background: h.color }}
              aria-hidden
            />
            <span className="arena-glass mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white">
              {h.label}
            </span>
          </button>

          {active === h.id && (
            <div className="arena-glass-strong absolute left-1/2 top-full z-10 mt-2 w-40 -translate-x-1/2 rounded-md p-3 text-left">
              <p
                className="text-[11px] font-bold tracking-wide"
                style={{ fontFamily: "var(--arena-font-display)", color: h.color }}
              >
                {h.label}
              </p>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">{h.desc}</p>
              <a href={h.href} className="mt-2 inline-block text-[11px] underline underline-offset-2" style={{ color: h.color }}>
                자세히 보기 →
              </a>
            </div>
          )}
        </div>
      ))}

      {/* 정보 오버레이 슬롯 — 상태/헤드라인/LIVE NOW를 이미지 위에 직접 배치 */}
      {overlay && <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">{overlay}</div>}
    </div>
  );
}
