import { Suspense } from "react";

import { Nav } from "@/components/nav";
import { ScanPageClient } from "./scan-page-client";

export default function ScanPage() {
  return (
    <main className="shell">
      <div className="page">
        <Nav />
        <Suspense fallback={<div className="empty-state">Preparing scan parameters...</div>}>
          <ScanPageClient />
        </Suspense>
      </div>
    </main>
  );
}
