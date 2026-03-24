"use client";

import { useEffect, useState } from "react";

import { ExploreGrid } from "@/components/explore-grid";
import { Nav } from "@/components/nav";
import type { ExploreResponse } from "@/lib/types";

export default function ExplorePage() {
  const [data, setData] = useState<ExploreResponse | null>(null);

  useEffect(() => {
    fetch("/api/explore?horizon=30d")
      .then((response) => response.json())
      .then((payload: ExploreResponse) => setData(payload));
  }, []);

  return (
    <main className="shell">
      <div className="page">
        <Nav />
        {data ? <ExploreGrid data={data} /> : <div className="empty-state">Scanning the leaderboard...</div>}
      </div>
    </main>
  );
}
