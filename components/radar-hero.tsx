const nodes = [
  { label: "agents", top: "22%", left: "66%" },
  { label: "browser-use", top: "58%", left: "72%" },
  { label: "mcp", top: "42%", left: "31%" },
  { label: "llm infra", top: "72%", left: "40%" },
];

export function RadarHero() {
  return (
    <div className="panel hero-visual">
      <div className="radar">
        <div className="radar-sweep" />
        <div className="radar-center" />
        {nodes.map((node) => (
          <div
            key={node.label}
            className="radar-node"
            data-label={node.label}
            style={{ top: node.top, left: node.left }}
          />
        ))}
      </div>
      <div className="hero-grid">
        <div className="score-card">
          <span className="subtle">Breakout confidence</span>
          <strong>86%</strong>
          <span className="subtle">Signal-backed ranking with explainable drivers</span>
        </div>
        <div className="score-card">
          <span className="subtle">Forecast windows</span>
          <strong>7 / 30 / 90</strong>
          <span className="subtle">Short, primary, and long-horizon scenarios</span>
        </div>
      </div>
    </div>
  );
}
