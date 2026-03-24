"use client";

import { FormEvent, useState } from "react";

import { CompareResult } from "@/components/compare-result";
import { Nav } from "@/components/nav";
import type { CompareResponse, Horizon } from "@/lib/types";

export default function ComparePage() {
  const [left, setLeft] = useState("https://github.com/vercel/next.js");
  const [right, setRight] = useState("https://github.com/anthropics/anthropic-cookbook");
  const [horizon, setHorizon] = useState<Horizon>("30d");
  const [result, setResult] = useState<CompareResponse | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: left, otherRepoUrl: right, horizon }),
    });
    setResult((await response.json()) as CompareResponse);
  }

  return (
    <main className="shell">
      <div className="page">
        <Nav />
        <div className="stack">
          <div className="panel">
            <div className="section-label">Compare Mode</div>
            <div className="repo-title">
              <div>
                <h1>Will this repo beat that one?</h1>
                <p className="lede">Compare two GitHub repos across the same forecast horizon and signal stack.</p>
              </div>
            </div>
            <form className="scan-form" onSubmit={handleSubmit}>
              <input className="field" value={left} onChange={(event) => setLeft(event.target.value)} />
              <input className="field" value={right} onChange={(event) => setRight(event.target.value)} />
              <select className="select" value={horizon} onChange={(event) => setHorizon(event.target.value as Horizon)}>
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="90d">90d</option>
              </select>
              <button className="button" type="submit">
                Compare
              </button>
            </form>
          </div>
          {result ? <CompareResult result={result} /> : null}
        </div>
      </div>
    </main>
  );
}
