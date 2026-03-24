import { Suspense } from "react";

import { Nav } from "@/components/nav";
import { RepoDetailClient } from "./repo-detail-client";

export default function RepoDetailPage() {
  return (
    <main className="shell">
      <div className="page">
        <Nav />
        <Suspense fallback={<div className="empty-state">Loading repository details...</div>}>
          <RepoDetailClient />
        </Suspense>
      </div>
    </main>
  );
}
