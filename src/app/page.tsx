"use client";

import { useEffect, useMemo, useState } from "react";
import { getExampleSchedule } from "@/lib/arena/schedule";
import { getPredictions, TransportMode } from "@/lib/arena/predict";
import { seedLiveIssues, LiveIssue } from "@/lib/arena/liveIssues";
import LiveIssueBoard from "@/components/arena/LiveIssueBoard";
import ParkSection from "@/components/arena/ParkSection";
import EatArenaZoneSection from "@/components/arena/EatArenaZoneSection";
import ToiletNowSection from "@/components/arena/ToiletNowSection";
import GoHomeSection from "@/components/arena/GoHomeSection";
import CompanionTimeSection from "@/components/arena/CompanionTimeSection";
import VoiceBoard from "@/components/arena/VoiceBoard";

const SHOWDAY_URL = "https://showday.kr";

const quickMenus = [
  { icon: "🚗", title: "가는길", sub: "대중교통·주차", target: "park", tone: "cyan" },
  { icon: "🍴", title: "주변맛집", sub: "공연 전후 맛집", target: "eat", tone: "cyan" },
  { icon: "👜", title: "현장서비스", sub: "짐보관·편의시설", target: "toilet", tone: "violet" },
  { icon: "🤖", title: "AI 추천", sub: "지금 필요한 정보", target: "ai-panel", tone: "blue" },
  { icon: "🎙", title: "LIVE NOW", sub: "실시간 현장 소식", target: "live-issues", tone: "blue" },
  { icon: "💗", title: "MY EVENT", sub: "나의 공연 일정", target: "my-event", tone: "pink" },
];

const defaultCopy = {
  eyebrow: "MUSIC BRINGS US TOGETHER",
  title1: "공연이 있는 날,",
  title2: "더 특별한 하루",
  subtitle: "공연부터 먹거리, 주차, 교통, 현장서비스까지\nARENA NOW가 함께합니다.",
  button: "지금 공연 정보 보기",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ArenaNowPage() {
  const [issues, setIssues] = useState<LiveIssue[]>(() => seedLiveIssues(Date.now()));
  const [transport, setTransport] = useState<TransportMode>("transit");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copy, setCopy] = useState(defaultCopy);

  useEffect(() => {
    const savedTransport = window.localStorage.getItem("arena-transport") as TransportMode | null;
    if (savedTransport === "car" || savedTransport === "transit" || savedTransport === "taxi") setTransport(savedTransport);
    const savedCopy = window.localStorage.getItem("arena-hero-copy");
    if (savedCopy) {
      try { setCopy({ ...defaultCopy, ...JSON.parse(savedCopy) }); } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("arena-transport", transport);
  }, [transport]);

  const schedule = useMemo(() => getExampleSchedule(new Date()), []);
  const predictions = useMemo(() => getPredictions("fiveHours", transport), [transport]);
  const activeIssues = issues.filter((i) => i.severity !== "general").slice(0, 3);

  const saveCopy = () => {
    window.localStorage.setItem("arena-hero-copy", JSON.stringify(copy));
    setSettingsOpen(false);
  };

  return (
    <main className="arena-home">
      <header className="arena-topbar">
        <div className="arena-topbar-inner">
          <a href={SHOWDAY_URL} className="arena-brand" aria-label="SHOWDAY로 이동">
            <strong>ARENA <span>NOW</span></strong>
            <small>CHANGDONG SEOUL ARENA</small>
          </a>
          <nav className="arena-main-nav" aria-label="메인 메뉴">
            <button onClick={() => scrollToId("today-show")}>공연정보</button>
            <button onClick={() => scrollToId("park")}>가는길</button>
            <button onClick={() => scrollToId("eat")}>주변맛집</button>
            <button onClick={() => scrollToId("toilet")}>현장서비스</button>
            <button onClick={() => scrollToId("ai-panel")}>AI 추천</button>
            <button onClick={() => scrollToId("my-event")}>MY EVENT</button>
          </nav>
          <div className="arena-top-actions">
            <button className="arena-icon-btn" aria-label="검색">⌕</button>
            <button className="arena-icon-btn" aria-label="내 정보">♙</button>
            <button className="arena-live-pill" onClick={() => scrollToId("live-issues")}><i /> LIVE NOW</button>
            <div className="arena-weather"><span>☀️</span><b>18°C</b><small>서울·도봉구</small></div>
          </div>
        </div>
      </header>

      <section className="arena-hero">
        <div className="arena-hero-bg" aria-hidden="true" />
        <div className="arena-hero-shade" />
        <div className="arena-hero-content">
          <div className="arena-hero-copy">
            <p className="arena-eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title1}<br /><span>{copy.title2}</span></h1>
            <p className="arena-subcopy">{copy.subtitle.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}</p>
            <button className="arena-gradient-btn" onClick={() => scrollToId("today-show")}>{copy.button} <b>→</b></button>
          </div>

          <aside className="arena-show-card" aria-label="다음 공연">
            <div className="arena-show-head"><span><i /> LIVE NOW</span><small>공연 진행 중</small></div>
            <p className="arena-label">오늘의 공연</p>
            <h2>K-POP SPECIAL CONCERT <em>DEMO</em></h2>
            <div className="arena-countdown"><b>05</b><span>:</span><b>12</b><span>:</span><b>30</b></div>
            <div className="arena-count-labels"><span>HOURS</span><span>MINS</span><span>SECS</span></div>
            <dl>
              <div><dt>▣</dt><dd>2026. 03. 15 (일) 19:00</dd></div>
              <div><dt>●</dt><dd>서울아레나(창동) · DEMO</dd></div>
            </dl>
            <button onClick={() => scrollToId("today-show")}>공연 상세보기 <b>→</b></button>
          </aside>
        </div>
      </section>

      <section className="arena-dashboard-wrap">
        <div className="arena-quick-grid" aria-label="빠른 서비스">
          {quickMenus.map((item) => (
            <button key={item.title} className={`arena-quick-card tone-${item.tone}`} onClick={() => scrollToId(item.target)}>
              <span className="arena-quick-icon">{item.icon}</span>
              <span><b>{item.title}</b><small>{item.sub}</small></span>
              <i>›</i>
            </button>
          ))}
        </div>

        <div className="arena-dashboard-grid">
          <article id="today-show" className="arena-panel today-panel">
            <div className="arena-panel-head"><h3>TODAY SHOW</h3><button>전체보기 ›</button></div>
            <div className="today-content">
              <div className="today-thumb"><span>♪</span></div>
              <div className="today-copy">
                <span className="today-chip">K-POP</span>
                <h4>K-POP SPECIAL CONCERT</h4>
                <p>2026. 03. 15 (일) 19:00</p>
                <p>서울아레나(창동) · DEMO</p>
                <div className="today-actions"><button>◉ 상세보기</button><button>⇧ 공유하기</button></div>
              </div>
            </div>
          </article>

          <article className="arena-panel live-panel">
            <div className="arena-panel-head"><h3><i className="live-dot" /> LIVE NOW <small>{activeIssues.length}건</small></h3><button onClick={() => scrollToId("live-issues")}>전체보기 ›</button></div>
            <div className="live-list">
              {(activeIssues.length ? activeIssues : seedLiveIssues(Date.now()).filter((i) => i.severity !== "general")).slice(0, 3).map((issue, idx) => (
                <div key={issue.id} className="live-row"><span className={`issue-icon issue-${idx}`}>{idx === 0 ? "⚠" : idx === 1 ? "🚻" : "▣"}</span><b>{issue.title}</b><em>중요</em><small>{idx === 0 ? "10:24" : idx === 1 ? "10:18" : "10:05"}</small></div>
              ))}
            </div>
          </article>

          <article id="ai-panel" className="arena-panel ai-panel">
            <div className="arena-panel-head"><h3>🤖 AI 추천 <small>맞춤형 추천 서비스</small></h3><button>전체보기 ›</button></div>
            <div className="ai-inner">
              <div>
                <h4>공연 가는 날,<br />이런 서비스도 필요하신가요?</h4>
                <p>AI가 당신의 상황에 맞는 정보를 추천해드립니다.</p>
                <div className="ai-buttons">
                  <button onClick={() => { setTransport("car"); scrollToId("park"); }}>주차 정보</button>
                  <button onClick={() => scrollToId("eat")}>맛집 추천</button>
                  <button onClick={() => scrollToId("toilet")}>짐보관</button>
                  <button onClick={() => scrollToId("go-home")}>귀가 교통</button>
                </div>
              </div>
              <div className="ai-robot">●<span>◡</span></div>
            </div>
          </article>
        </div>

        <div id="my-event" className="arena-promo-row">
          <div className="arena-promo-large">
            <div className="promo-art">♫</div>
            <div><b>공연의 감동을<br />더 오래, 더 가까이</b><p>공연 전후, 아레나 주변의 다양한 즐길거리를 지금 바로 확인해보세요.</p></div>
            <button>→</button>
          </div>
          <button onClick={() => scrollToId("eat")}><span>☕</span><b>맛집·카페</b><small>맛있는 즐거움</small></button>
          <button onClick={() => scrollToId("toilet")}><span>🔒</span><b>짐보관 서비스</b><small>안전한 보관</small></button>
          <button onClick={() => scrollToId("go-home")}><span>🚌</span><b>귀가 교통</b><small>택시·셔틀버스</small></button>
          <button><span>🎁</span><b>이벤트·기념품</b><small>특별한 추억</small></button>
        </div>
      </section>

      <section className="arena-deep-sections">
        <div className="section-lead"><span>MORE SERVICES</span><h2>필요할 때 바로 쓰는 공연 당일 서비스</h2><p>아래 기능은 실제 서비스 연동을 위한 상세 영역입니다.</p></div>
        <LiveIssueBoard issues={issues} setIssues={setIssues} accent="#7c5cff" />
        <ParkSection accent="#7c5cff" />
        <EatArenaZoneSection accent="#20d6da" />
        <ToiletNowSection accent="#ffd23f" />
        <GoHomeSection accent="#20d6da" />
        <CompanionTimeSection accent="#ff4d8d" />
        <VoiceBoard accent="#57c9ff" />
      </section>

      <footer className="arena-footer">
        <div><strong>ARENA NOW</strong><span>CHANGDONG SEOUL ARENA</span></div>
        <nav><a href="#">이용약관</a><a href="#">개인정보처리방침</a><a href="#">고객센터</a><a href="#">제휴문의</a></nav>
        <p>AI-generated concept image · 실제 시설 및 배치와 다를 수 있습니다.</p>
        <small>© 2026 ARENA NOW · Concept Prototype</small>
      </footer>

      <button className="arena-settings-btn" onClick={() => setSettingsOpen(true)} aria-label="메인 문구 설정">⚙</button>
      {settingsOpen && (
        <div className="arena-settings-overlay" onClick={() => setSettingsOpen(false)}>
          <aside className="arena-settings-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="settings-head"><div><b>메인 화면 텍스트 설정</b><small>브라우저에 저장됩니다.</small></div><button onClick={() => setSettingsOpen(false)}>×</button></div>
            <label>상단 영문 카피<input value={copy.eyebrow} onChange={(e) => setCopy({ ...copy, eyebrow: e.target.value })} /></label>
            <label>메인 제목 1줄<input value={copy.title1} onChange={(e) => setCopy({ ...copy, title1: e.target.value })} /></label>
            <label>메인 제목 2줄<input value={copy.title2} onChange={(e) => setCopy({ ...copy, title2: e.target.value })} /></label>
            <label>설명 문구<textarea rows={4} value={copy.subtitle} onChange={(e) => setCopy({ ...copy, subtitle: e.target.value })} /></label>
            <label>메인 버튼<input value={copy.button} onChange={(e) => setCopy({ ...copy, button: e.target.value })} /></label>
            <div className="settings-actions"><button onClick={() => setCopy(defaultCopy)}>초기화</button><button className="save" onClick={saveCopy}>저장</button></div>
          </aside>
        </div>
      )}
    </main>
  );
}
