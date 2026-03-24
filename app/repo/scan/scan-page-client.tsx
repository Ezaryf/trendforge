"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ScanResult } from "@/components/scan-result";
import type { ScanResponse } from "@/lib/types";

export function ScanPageClient() {
  const params = useSearchParams();
  const repo = params.get("repo");
  const horizon = params.get("horizon") ?? "30d";
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;
    const controller = new AbortController();
    setResult(null);
    setError(null);

    fetch(`/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: repo, horizon }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Scan failed");
        }
        return response.json();
      })
      .then((payload: ScanResponse) => setResult(payload))
      .catch((value) => {
        if ((value as Error).name !== "AbortError") {
          setError((value as Error).message);
        }
      });

    return () => controller.abort();
  }, [repo, horizon]);

  if (!repo) {
    return <div className="empty-state">Add a repo query string such as `?repo=https://github.com/vercel/next.js`.</div>;
  }

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  if (!result) {
    return <div className="empty-state">Collecting GitHub signals and assembling the forecast...</div>;
  }

  return <ScanResult result={result} />;
}
