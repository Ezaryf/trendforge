import type { SignalBreakdown } from "@/lib/types";

const labels: Array<{ key: keyof SignalBreakdown; label: string }> = [
  { key: "momentum", label: "Momentum" },
  { key: "acceleration", label: "Acceleration" },
  { key: "maintenanceHealth", label: "Health" },
  { key: "contributorActivity", label: "Contributors" },
  { key: "releaseCadence", label: "Releases" },
  { key: "socialBuzz", label: "Buzz" },
  { key: "ecosystemSimilarity", label: "Fit" },
];

export function RadarChart({ signals }: { signals: SignalBreakdown }) {
  const center = 150;
  const radius = 104;
  const points = labels.map((item, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const value = signals[item.key] / 100;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    const labelX = center + Math.cos(angle) * (radius + 28);
    const labelY = center + Math.sin(angle) * (radius + 28);
    return { x, y, labelX, labelY, label: item.label };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z";

  return (
    <div className="chart-card score-card">
      <div className="section-label">Reason Graph</div>
      <h3>Leading indicators</h3>
      <svg viewBox="0 0 300 300" role="img" aria-label="Signal radar">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={radius * ring}
            fill="none"
            stroke="rgba(131, 194, 255, 0.12)"
          />
        ))}
        {labels.map((_, index) => {
          const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              stroke="rgba(131, 194, 255, 0.12)"
            />
          );
        })}
        <path d={path} fill="rgba(100, 210, 255, 0.2)" stroke="var(--cyan)" strokeWidth="3" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" fill="var(--cyan)" />
            <text x={point.labelX} y={point.labelY} textAnchor="middle" fill="var(--muted)" fontSize="11">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
