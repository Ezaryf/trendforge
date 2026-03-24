import { formatPercent } from "@/lib/format";
import type { CompareResponse } from "@/lib/types";

export function CompareResult({ result }: { result: CompareResponse }) {
  return (
    <div className="stack">
      <div className="panel">
        <div className="section-label">Head To Head</div>
        <div className="repo-title">
          <div>
            <h1>{result.winner}</h1>
            <p className="lede">{result.summary}</p>
          </div>
          <span className="pill">{result.horizon}</span>
        </div>
      </div>
      <div className="compare-cards">
        {[result.left, result.right].map((item) => (
          <div key={item.repo.fullName} className="list-card">
            <strong>{item.repo.fullName}</strong>
            <div className="mini-row">
              <span className="subtle">Trend score</span>
              <strong>{item.trendScore}</strong>
            </div>
            <div className="mini-row">
              <span className="subtle">Breakout probability</span>
              <strong>{formatPercent(item.breakoutProbability)}</strong>
            </div>
            <div className="mini-row">
              <span className="subtle">Top driver</span>
              <strong>{item.topDrivers[0]?.title ?? "Signal stack"}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
