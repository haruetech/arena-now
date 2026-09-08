import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARENA NOW | 공연 당일의 모든 순간",
  description:
    "공연정보부터 주차, 먹거리, 현장서비스, LIVE NOW, AI 추천, 귀가까지 공연 당일의 불편을 줄이는 ARENA NOW입니다.",
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
