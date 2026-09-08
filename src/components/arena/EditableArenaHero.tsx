"use client";

import { useEffect, useState } from "react";
import TodayShowCard from "./TodayShowCard";
import LiveNowWidget from "./LiveNowWidget";
import type { LiveIssue } from "@/lib/arena/liveIssues";

export type HeroCopy = {
  heroImage: string;
  brandSub: string;
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  cta: string;
  navShow: string;
  navRoute: string;
  navFood: string;
  navService: string;
  navAi: string;
  navMy: string;
  pinPark: string;
  pinStation: string;
  pinFood: string;
  pinEntrance: string;
  pinToilet: string;
  liveLabel: string;
  bottomSlogan: string;
};

const DEFAULT_COPY: HeroCopy = {
  heroImage: "/arena-hero-concept.jpg",
  brandSub: "CHANGDONG SEOUL ARENA",
  eyebrow: "YOUR SPECIAL SHOW DAY",
  title1: "공연이 있는 날,",
  title2: "더 편안한 하루",
  subtitle: "주차부터 입장·화장실·먹거리·귀가까지, 지금 필요한 것만 먼저 보여드립니다.",
  cta: "지금 필요한 것 보기",
  navShow: "공연정보",
  navRoute: "가는길",
  navFood: "주변맛집",
  navService: "현장서비스",
  navAi: "AI 추천",
  navMy: "MY EVENT",
  pinPark: "주차장",
  pinStation: "창동역",
  pinFood: "푸드존",
  pinEntrance: "입장게이트",
  pinToilet: "화장실",
  liveLabel: "LIVE NOW",
  bottomSlogan: "A BETTER SHOW DAY, BEFORE & AFTER THE SHOW",
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function EditableArenaHero({
  accent,
  badge,
  issues,
  showStart,
}: {
  accent: string;
  badge: string;
  issues: LiveIssue[];
  showStart: Date;
}) {
  const [copy, setCopy] = useState<HeroCopy>(DEFAULT_COPY);
  const [draft, setDraft] = useState<HeroCopy>(DEFAULT_COPY);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("arena-hero-copy-v1");
      if (raw) {
        const parsed = { ...DEFAULT_COPY, ...JSON.parse(raw) } as HeroCopy;
        setCopy(parsed);
        setDraft(parsed);
      }
    } catch {}
  }, []);

  const save = () => {
    setCopy(draft);
    window.localStorage.setItem("arena-hero-copy-v1", JSON.stringify(draft));
    setEditorOpen(false);
  };

  const reset = () => {
    setDraft(DEFAULT_COPY);
    setCopy(DEFAULT_COPY);
    window.localStorage.removeItem("arena-hero-copy-v1");
  };

  return (
    <>
      <section className="arena-premium-hero" aria-label="ARENA NOW 메인">
        <div className="arena-hero-bg" style={{ backgroundImage: `url(${copy.heroImage})` }} />
        <div className="arena-hero-shade" />

        <header className="arena-hero-nav">
          <div className="arena-brand">
            <strong>ARENA NOW</strong>
            <span>{copy.brandSub}</span>
          </div>
          <nav className="arena-desktop-nav" aria-label="메인 메뉴">
            <button onClick={() => scrollTo("show")}>{copy.navShow}</button>
            <button onClick={() => scrollTo("park")}>{copy.navRoute}</button>
            <button onClick={() => scrollTo("eat")}>{copy.navFood}</button>
            <button onClick={() => scrollTo("live-issues")}>{copy.navService}</button>
            <button onClick={() => scrollTo("now-ai")}>{copy.navAi}</button>
            <button onClick={() => scrollTo("my-event")}>{copy.navMy}</button>
          </nav>
          <button className="arena-live-pill" onClick={() => scrollTo("live-issues")}>
            <span /> {copy.liveLabel}
          </button>
        </header>

        <div className="arena-hero-content">
          <div className="arena-hero-copy">
            <p className="arena-eyebrow">{copy.eyebrow}</p>
            <h1>
              <span>{copy.title1}</span>
              <em>{copy.title2}</em>
            </h1>
            <p className="arena-hero-sub">{copy.subtitle}</p>
            <button className="arena-primary-cta" onClick={() => scrollTo("now-ai")}>
              {copy.cta} <b>→</b>
            </button>
          </div>

          <div className="arena-next-show-card">
            <div className="arena-next-label"><span /> NEXT SHOW</div>
            <div className="arena-next-badge">{badge}</div>
            <TodayShowCard showStart={showStart} accent={accent} />
          </div>

          <button className="arena-pin arena-pin-park" onClick={() => scrollTo("park")}><i>Ⓟ</i><span>{copy.pinPark}<small>PARKING</small></span></button>
          <button className="arena-pin arena-pin-station" onClick={() => scrollTo("after")}><i>▣</i><span>{copy.pinStation}<small>SUBWAY</small></span></button>
          <button className="arena-pin arena-pin-food" onClick={() => scrollTo("eat")}><i>♨</i><span>{copy.pinFood}<small>FOOD</small></span></button>
          <button className="arena-pin arena-pin-entrance" onClick={() => scrollTo("live-issues")}><i>⌂</i><span>{copy.pinEntrance}<small>ENTRANCE</small></span></button>
          <button className="arena-pin arena-pin-toilet" onClick={() => scrollTo("toilet")}><i>♟</i><span>{copy.pinToilet}<small>TOILET</small></span></button>

          <div className="arena-hero-live"><LiveNowWidget issues={issues} /></div>
        </div>

        <div className="arena-hero-actions">
          <button onClick={() => scrollTo("park")}><span>🚗</span><b>{copy.navRoute}</b><small>대중교통·주차</small></button>
          <button onClick={() => scrollTo("eat")}><span>🍴</span><b>{copy.navFood}</b><small>공연 전후 맛집</small></button>
          <button onClick={() => scrollTo("toilet")}><span>👜</span><b>{copy.navService}</b><small>화장실·짐보관</small></button>
          <button onClick={() => scrollTo("now-ai")}><span>✦</span><b>{copy.navAi}</b><small>지금 필요한 정보</small></button>
          <button onClick={() => scrollTo("voice")}><span>🎙</span><b>VOICE</b><small>실시간 현장 소식</small></button>
          <button onClick={() => scrollTo("my-event")}><span>♥</span><b>{copy.navMy}</b><small>나의 공연 일정</small></button>
        </div>

        <div className="arena-hero-notice">
          <span>● NOTICE</span>
          <p>현장 혼잡도와 운영 정보는 상황에 따라 변경될 수 있습니다.</p>
          <strong>{copy.bottomSlogan}</strong>
        </div>
      </section>

      <button className="arena-edit-trigger" onClick={() => { setDraft(copy); setEditorOpen(true); }} aria-label="메인 텍스트 편집">⚙</button>

      {editorOpen && (
        <div className="arena-editor-backdrop" onMouseDown={() => setEditorOpen(false)}>
          <aside className="arena-editor" onMouseDown={(e) => e.stopPropagation()}>
            <div className="arena-editor-head">
              <div><strong>메인 화면 편집</strong><small>문구를 각각 직접 수정할 수 있습니다.</small></div>
              <button onClick={() => setEditorOpen(false)}>✕</button>
            </div>
            <div className="arena-editor-scroll">
              <EditorGroup title="히어로 문구">
                <Field label="배경 이미지 URL" value={draft.heroImage} set={(v) => setDraft({ ...draft, heroImage: v })} />
                <Field label="브랜드 서브" value={draft.brandSub} set={(v) => setDraft({ ...draft, brandSub: v })} />
                <Field label="상단 라벨" value={draft.eyebrow} set={(v) => setDraft({ ...draft, eyebrow: v })} />
                <Field label="메인 제목 1" value={draft.title1} set={(v) => setDraft({ ...draft, title1: v })} />
                <Field label="메인 제목 2" value={draft.title2} set={(v) => setDraft({ ...draft, title2: v })} />
                <TextArea label="설명" value={draft.subtitle} set={(v) => setDraft({ ...draft, subtitle: v })} />
                <Field label="메인 버튼" value={draft.cta} set={(v) => setDraft({ ...draft, cta: v })} />
              </EditorGroup>
              <EditorGroup title="상단 메뉴">
                <Field label="공연정보" value={draft.navShow} set={(v) => setDraft({ ...draft, navShow: v })} />
                <Field label="가는길" value={draft.navRoute} set={(v) => setDraft({ ...draft, navRoute: v })} />
                <Field label="주변맛집" value={draft.navFood} set={(v) => setDraft({ ...draft, navFood: v })} />
                <Field label="현장서비스" value={draft.navService} set={(v) => setDraft({ ...draft, navService: v })} />
                <Field label="AI 추천" value={draft.navAi} set={(v) => setDraft({ ...draft, navAi: v })} />
                <Field label="MY EVENT" value={draft.navMy} set={(v) => setDraft({ ...draft, navMy: v })} />
              </EditorGroup>
              <EditorGroup title="조감도 핫스팟">
                <Field label="주차장" value={draft.pinPark} set={(v) => setDraft({ ...draft, pinPark: v })} />
                <Field label="창동역" value={draft.pinStation} set={(v) => setDraft({ ...draft, pinStation: v })} />
                <Field label="푸드존" value={draft.pinFood} set={(v) => setDraft({ ...draft, pinFood: v })} />
                <Field label="입장게이트" value={draft.pinEntrance} set={(v) => setDraft({ ...draft, pinEntrance: v })} />
                <Field label="화장실" value={draft.pinToilet} set={(v) => setDraft({ ...draft, pinToilet: v })} />
              </EditorGroup>
              <EditorGroup title="기타">
                <Field label="LIVE NOW" value={draft.liveLabel} set={(v) => setDraft({ ...draft, liveLabel: v })} />
                <TextArea label="하단 슬로건" value={draft.bottomSlogan} set={(v) => setDraft({ ...draft, bottomSlogan: v })} />
              </EditorGroup>
            </div>
            <div className="arena-editor-footer">
              <button className="secondary" onClick={reset}>초기화</button>
              <button className="primary" onClick={save}>저장하기</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function EditorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="arena-editor-group"><h3>{title}</h3>{children}</section>;
}
function Field({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return <label className="arena-edit-field"><span>{label}</span><input value={value} onChange={(e) => set(e.target.value)} /></label>;
}
function TextArea({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return <label className="arena-edit-field"><span>{label}</span><textarea rows={3} value={value} onChange={(e) => set(e.target.value)} /></label>;
}
