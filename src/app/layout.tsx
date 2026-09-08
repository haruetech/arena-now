import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARENA NOW — THE SHOW STARTS BEFORE THE SHOW.",
  description:
    "공연 시작 전부터 공연 후 귀가까지, 공연 가는 하루를 시간과 상황으로 설계하는 SHOWDAY의 아레나 경험 컨셉 프로토타입입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;500;700;900&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="arena-scope min-h-screen">{children}</div>
      </body>
    </html>
  );
}
