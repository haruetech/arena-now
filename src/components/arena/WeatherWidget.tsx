// 상단바 날씨 위젯. 실제 서비스에서는 기상청/날씨 API와 연동해
// SMART ALERT의 "D-1 날씨 준비" 알림과 연결됩니다. 지금은 예시(DEMO)입니다.
export default function WeatherWidget() {
  return (
    <div className="hidden items-center gap-2 text-[10px] text-[var(--arena-muted)] lg:flex">
      <span className="text-base">☀️</span>
      <div className="leading-tight">
        <p className="text-white">서울·도봉구 18°C</p>
        <p>맑음 · 공연 관람하기 좋은 날씨</p>
      </div>
    </div>
  );
}
