import Link from "next/link";

import { Nav } from "@/components/nav";
import { RadarHero } from "@/components/radar-hero";
import { ScanForm } from "@/components/scan-form";

const topics = ["AI Agents", "MCP Servers", "Browser Automation", "Dev Infra", "Open Models"];

export default function HomePage() {
  return (
    <main className="shell">
      <div className="page">
        <Nav />
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">GitHub Future Radar</div>
            <h1>Predict the next breakout repo.</h1>
            <p>
              TrendForge turns repository activity into a measurable forecast: breakout probability, projected growth,
              and the signal graph behind the call.
            </p>
            <ScanForm />
            <div className="chips">
              {topics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
            <div className="chips" style={{ marginTop: 28 }}>
              <Link href="/explore" className="ghost-button">
                Explore future winners
              </Link>
              <Link href="/compare" className="ghost-button">
                Compare two repos
              </Link>
            </div>
          </div>
          <RadarHero />
        </section>
      </div>
    </main>
  );
}
