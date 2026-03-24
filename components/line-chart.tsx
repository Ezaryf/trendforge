import type { ForecastPoint } from "@/lib/types";

function scale(points: ForecastPoint[], width: number, height: number) {
  const maxDay = Math.max(...points.map((point) => point.day), 1);
  const maxStars = Math.max(...points.map((point) => point.stars), 1);

  return points.map((point) => ({
    x: (point.day / maxDay) * width,
    y: height - (point.stars / maxStars) * height,
    segment: point.segment,
  }));
}

function toPath(points: { x: number; y: number }[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

export function LineChart({ points }: { points: ForecastPoint[] }) {
  const width = 640;
  const height = 240;
  const scaled = scale(points, width, height);
  const past = scaled.filter((point) => point.segment === "historical");
  const future = scaled.filter((point) => point.segment === "forecast");
  const bridge = future.length > 0 && past.length > 0 ? [past.at(-1)!, ...future] : future;

  return (
    <div className="chart-card score-card">
      <div className="row">
        <div>
          <div className="section-label">Growth Curve</div>
          <h3>Observed vs forecast stars</h3>
        </div>
        <div className="legend">
          <span className="past">Historical</span>
          <span className="future">Forecast</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height + 16}`} role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id="future-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
        <g transform="translate(0,8)">
          {[0.25, 0.5, 0.75].map((mark) => (
            <line
              key={mark}
              x1={0}
              x2={width}
              y1={height * mark}
              y2={height * mark}
              stroke="rgba(131, 194, 255, 0.12)"
              strokeDasharray="5 8"
            />
          ))}
          <path d={toPath(past)} fill="none" stroke="var(--cyan)" strokeWidth="4" />
          <path d={toPath(bridge)} fill="none" stroke="url(#future-fill)" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}
