import Link from "next/link";

import { formatCompact, formatPercent } from "@/lib/format";
import type { ExploreResponse } from "@/lib/types";

export function ExploreGrid({ data }: { data: ExploreResponse }) {
  return (
    <div className="stack">
      <div className="panel">
        <div className="section-label">Future Winners</div>
        <div className="repo-title">
          <div>
            <h1>Ranked breakouts</h1>
            <p className="lede">
              A live ranking of repositories whose signal stack suggests unusual near-term breakout potential.
            </p>
          </div>
          <span className="pill">{data.horizon} window</span>
        </div>
      </div>
      <div className="list-grid">
        {data.items.map((item, index) => (
          <Link key={item.repo.fullName} href={`/repo/${item.repo.owner}/${item.repo.repo}`} className="list-card">
            <div className="mini-row">
              <span className="section-label">#{index + 1}</span>
              <span className="pill">{item.trendScore}</span>
            </div>
            <strong>{item.repo.fullName}</strong>
            <span className="subtle">{item.repo.description}</span>
            <div className="mini-row">
              <span className="subtle">Breakout</span>
              <strong>{formatPercent(item.breakoutProbability)}</strong>
            </div>
            <div className="mini-row">
              <span className="subtle">Stars</span>
              <strong>{formatCompact(item.repo.stars)}</strong>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
