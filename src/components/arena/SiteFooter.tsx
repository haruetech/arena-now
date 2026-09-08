const links = ["이용약관", "개인정보처리방침", "고객센터", "제휴문의"];
const socials = ["YouTube", "Instagram", "X"];

export default function SiteFooter({ tagline = "Your Stage, Our Day" }: { tagline?: string }) {
  return (
    <footer className="border-t border-white/10 bg-[#030914] pb-20 sm:pb-0">
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-4 px-4 py-8 text-[11px] text-[var(--arena-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div><p className="text-sm font-bold text-white" style={{ fontFamily: "var(--arena-font-display)" }}>ARENA NOW</p><p className="mt-1">CHANGDONG SEOUL ARENA</p></div>
        <div className="flex flex-wrap gap-3">{links.map((l) => <span key={l} className="hover:text-white">{l}</span>)}</div>
        <div className="flex items-center gap-3">{socials.map((s) => <span key={s} className="rounded-full border border-white/15 px-2 py-1 text-[9px]">{s}</span>)}</div>
      </div>
      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-1 px-4 pb-6 text-[10px] text-[var(--arena-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>© 2026 ARENA NOW. All Rights Reserved. (컨셉 프로토타입)</p><p className="italic text-white/65">{tagline}</p></div>
    </footer>
  );
}
