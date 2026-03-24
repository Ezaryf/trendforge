const nodes = [
  { label: "agents", top: "22%", left: "66%" },
  { label: "browser-use", top: "58%", left: "72%" },
  { label: "mcp", top: "42%", left: "31%" },
  { label: "llm infra", top: "72%", left: "40%" },
];

export function RadarHero() {
  return (
    <div className="radar-cinematic">
      <div className="radar-sweep-cinematic" />
      <div className="radar-center-cinematic" />
      {nodes.map((node) => (
        <div
          key={node.label}
          className="radar-node-cinematic"
          data-label={node.label}
          style={{ top: node.top, left: node.left }}
        />
      ))}
    </div>
  );
}
