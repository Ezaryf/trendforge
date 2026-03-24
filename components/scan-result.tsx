import Link from "next/link";

import { formatCompact, formatPercent, relativeDate } from "@/lib/format";
import type { ScanResponse } from "@/lib/types";
import { LineChart } from "./line-chart";
import { RadarChart } from "./radar-chart";

export function ScanResult({ result }: { result: ScanResponse }) {
  return (
    <div className="dashboard-grid">
      <div className="stack">
        <div className="panel summary-card">
          <div className="section-label">Repo Summary</div>
          <div className="repo-title">
            <div>
              <h1>{result.repo.repo}</h1>
              <div className="subtle">{result.repo.owner}</div>
            </div>
            <span className="pill">{result.horizon} horizon</span>
          </div>
          <p className="lede">{result.repo.description || "A repository with emerging signal momentum."}</p>
          <div className="stat-grid">
            <div className="metric-card score-card">
              <span className="subtle">Trend score</span>
              <span className="metric-number">{result.trendScore}</span>
            </div>
            <div className="metric-card score-card">
              <span className="subtle">Breakout probability</span>
              <span className="metric-number">{formatPercent(result.breakoutProbability)}</span>
            </div>
            <div className="metric-card score-card">
              <span className="subtle">Stars</span>
              <span className="metric-number">{formatCompact(result.repo.stars)}</span>
            </div>
            <div className="metric-card score-card">
              <span className="subtle">Last push</span>
              <span className="metric-number" style={{ fontSize: "1.4rem" }}>
                {relativeDate(result.repo.lastPush)}
              </span>
            </div>
          </div>
          <div className="row">
            <span className="subtle">{result.repo.language || "Mixed"} primary</span>
            <a href={result.repo.url} target="_blank" rel="noreferrer" className="ghost-button">
              Open GitHub
            </a>
          </div>
        </div>

        <div className="panel">
          <div className="section-label">Why It Might Rise</div>
          <h3>{result.narrative}</h3>
          <ol className="reason-list">
            {result.topDrivers.map((driver) => (
              <li key={driver.title}>
                <strong style={{ color: "var(--text)" }}>{driver.title}</strong> {driver.detail}
              </li>
            ))}
          </ol>
          <div className="section-label" style={{ marginTop: 22 }}>
            Risk Factors
          </div>
          <ul className="risk-list">
            {result.riskFactors.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chart-shell">
        <LineChart points={result.predictedGrowthCurve} />
        <div className="signals-grid">
          <RadarChart signals={result.signalBreakdown} />
          <div className="chart-card score-card">
            <div className="section-label">Confidence Band</div>
            <h3>Projected star range</h3>
            <div className="stack">
              {[
                ["Low", result.confidenceBand.low],
                ["Mid", result.confidenceBand.mid],
                ["High", result.confidenceBand.high],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mini-row">
                    <span className="subtle">{label}</span>
                    <strong>{formatCompact(Number(value))}</strong>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${Math.min(Number(value) / result.confidenceBand.high, 1) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="row">
            <div>
              <div className="section-label">Similar Winners</div>
              <h3>Historical analogs</h3>
            </div>
            <Link href="/compare" className="ghost-button">
              Compare repos
            </Link>
          </div>
          <div className="list-grid">
            {result.similarRepos.map((repo) => (
              <Link key={repo.repo} href={`/repo/${repo.owner}/${repo.repo}`} className="list-card">
                <div className="row">
                  <strong>
                    {repo.owner}/{repo.repo}
                  </strong>
                  <span className="pill">{repo.score}</span>
                </div>
                <span className="subtle">{repo.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
