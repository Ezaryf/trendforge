import Link from "next/link";

import { Nav } from "@/components/nav";
import { RadarHero } from "@/components/radar-hero";
import { ScanForm } from "@/components/scan-form";

const topics = ["AI Agents", "MCP Servers", "Browser Automation", "Dev Infra", "Open Models"];

export default function HomePage() {
  return (
    <main className="shell">
      <RadarHero />
      <div className="page page-cinematic">
        <Nav />
        <section className="hero-cinematic">
          <div className="hero-copy-centered">
            <div className="eyebrow glow-text">GitHub Future Radar</div>
            <h1 className="cinematic-title">Predict the next breakout repo.</h1>
            <p className="cinematic-lede">
              TrendForge turns repository activity into a measurable forecast: breakout probability, projected growth,
              and the signal graph behind the call.
            </p>
            
            <div className="scan-center">
              <ScanForm />
            </div>
            
            <div className="chips-center">
              {topics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
            
            <div className="stats-center glass-panel">
              <div className="stat-item">
                <span className="subtle">Breakout confidence</span>
                <strong>86%</strong>
              </div>
              <div className="spacer" />
              <div className="stat-item">
                <span className="subtle">Forecast windows</span>
                <strong>7 / 30 / 90</strong>
              </div>
            </div>
            
            <div className="chips-center" style={{ marginTop: 24 }}>
              <Link href="/explore" className="ghost-button">
                Explore future winners
              </Link>
              <Link href="/compare" className="ghost-button">
                Compare two repos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
