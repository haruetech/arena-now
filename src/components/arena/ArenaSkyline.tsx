"use client";

import { useState } from "react";

// 서울아레나를 그대로 복제하지 않은, 미래형 K-POP 아레나 컨셉 일러스트입니다.
// (docs/arena-now-vision.md 참고 — 운영 단계에서는 사용 허가 이미지로 교체)

interface Hotspot {
  id: string;
  label: string;
  desc: string;
  x: number; // %
  y: number; // %
  href: string;
}

const hotspots: Hotspot[] = [
  { id: "show", label: "SHOW", desc: "오늘 공연 정보", x: 50, y: 40, href: "#show" },
  { id: "park", label: "PARK", desc: "주차 위치·요금", x: 18, y: 58, href: "#park" },
  { id: "eat", label: "EAT", desc: "공연 전 식사·팝업", x: 82, y: 58, href: "#eat" },
  { id: "toilet", label: "TOILET", desc: "안 붐비는 화장실", x: 30, y: 78, href: "#toilet" },
  { id: "companion", label: "COMPANION", desc: "동행자의 시간", x: 70, y: 78, href: "#companion" },
  { id: "home", label: "HOME", desc: "귀가·만남 장소", x: 50, y: 90, href: "#after" },
];

export default function ArenaSkyline({ accent }: { accent: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[var(--arena-border)]">
      <svg
        viewBox="0 0 400 250"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07060f" />
            <stop offset="100%" stopColor="#161225" />
          </linearGradient>
          <radialGradient id="domeGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.65" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="domeBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1930" />
            <stop offset="100%" stopColor="#0c0a16" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="250" fill="url(#sky)" />

        {/* 별 */}
        {[...Array(40)].map((_, i) => (
          <circle
            key={i}
            cx={(i * 31) % 400}
            cy={(i * 47) % 100}
            r={i % 6 === 0 ? 1.3 : 0.6}
            fill="#ffffff"
            opacity={0.3 + (i % 5) * 0.13}
          />
        ))}

        {/* 도시 실루엣 */}
        <g fill="#0a0912">
          <rect x="0" y="175" width="35" height="75" />
          <rect x="40" y="155" width="26" height="95" />
          <rect x="345" y="165" width="30" height="85" />
          <rect x="378" y="145" width="24" height="105" />
        </g>

        {/* 아레나 후광 */}
        <ellipse cx="200" cy="150" rx="170" ry="100" fill="url(#domeGlow)" />

        {/* 빛줄기 (미래형 아레나 특징) */}
        <g opacity="0.5">
          {[-60, -30, 0, 30, 60].map((angle, i) => (
            <line
              key={i}
              x1="200"
              y1="120"
              x2={200 + Math.sin((angle * Math.PI) / 180) * 140}
              y2={120 - Math.cos((angle * Math.PI) / 180) * 140}
              stroke={accent}
              strokeWidth="1.2"
              strokeOpacity={0.35 - i * 0.03}
            />
          ))}
        </g>

        {/* 지지 구조물(플로팅 아레나 느낌) */}
        <g stroke={accent} strokeOpacity="0.4" strokeWidth="1">
          <line x1="130" y1="200" x2="150" y2="215" />
          <line x1="270" y1="200" x2="250" y2="215" />
        </g>

        {/* 아레나 돔 본체 */}
        <path
          d="M 85 205 Q 85 100 200 92 Q 315 100 315 205 Z"
          fill="url(#domeBody)"
          stroke={accent}
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />

        {/* 미디어 파사드 격자 패턴 */}
        <g stroke={accent} strokeOpacity="0.22" strokeWidth="0.6">
          {[...Array(9)].map((_, i) => {
            const x = 100 + i * 25;
            return <line key={i} x1={x} y1="205" x2={200} y2="94" />;
          })}
          {[130, 150, 170, 190].map((y, i) => (
            <path
              key={i}
              d={`M ${90 + i * 3} ${y} Q 200 ${y - 10} ${310 - i * 3} ${y}`}
              fill="none"
            />
          ))}
        </g>

        {/* 돔 상단 링 (헤일로) */}
        <ellipse
          cx="200"
          cy="92"
          rx="55"
          ry="8"
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />

        {/* 바닥 반사 */}
        <ellipse cx="200" cy="212" rx="130" ry="14" fill="url(#ground)" />
      </svg>

      {/* Hotspots */}
      {hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => setActive(active === h.id ? null : h.id)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span
            className="arena-drift block h-3 w-3 rounded-full ring-4 ring-white/10"
            style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
          />
          {active === h.id && (
            <div className="arena-glass-strong absolute left-1/2 top-5 z-10 w-40 -translate-x-1/2 rounded-md p-3 text-left">
              <p
                className="text-[11px] font-bold tracking-wide"
                style={{ fontFamily: "var(--arena-font-display)", color: accent }}
              >
                {h.label}
              </p>
              <p className="mt-1 text-xs text-[var(--arena-muted)]">{h.desc}</p>
              <a
                href={h.href}
                className="mt-2 inline-block text-[11px] underline underline-offset-2"
                style={{ color: accent }}
              >
                자세히 보기 →
              </a>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
