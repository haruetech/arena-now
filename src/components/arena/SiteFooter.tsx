const links = ["이용약관", "개인정보처리방침", "고객센터", "제휴문의"];
const socials = ["YouTube", "Instagram", "X"];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 pb-20 sm:pb-0">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-8 text-[11px] text-[var(--arena-muted)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--arena-font-display)" }}>
            ARENA NOW
          </p>
          <p className="mt-1">CHANGDONG SEOUL ARENA</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {links.map((l) => (
            <span key={l} className="hover:text-white">{l}</span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <span key={s} className="rounded-full border border-white/15 px-2 py-1 text-[9px]">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-1 px-6 pb-6 text-[10px] text-[var(--arena-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ARENA NOW. All Rights Reserved. (컨셉 프로토타입)</p>
        <p className="italic">Your Stage, Our Day</p>
      </div>
    </footer>
  );
}
