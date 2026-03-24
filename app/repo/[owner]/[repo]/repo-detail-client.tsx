"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ScanResult } from "@/components/scan-result";
import type { ScanResponse } from "@/lib/types";

export function RepoDetailClient() {
  const params = useParams<{ owner: string; repo: string }>();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const repoUrl = `https://github.com/${params.owner}/${params.repo}`;
    const horizon = searchParams.get("horizon") ?? "30d";

    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, horizon }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Scan failed");
        }
        return response.json();
      })
      .then((payload: ScanResponse) => {
        if (active) setResult(payload);
      })
      .catch((value) => {
        if (active) setError((value as Error).message);
      });

    return () => {
      active = false;
    };
  }, [params.owner, params.repo, searchParams]);

  if (error) {
    return <div className="empty-state">{error}</div>;
  }

  if (!result) {
    return <div className="empty-state">Building repository deep dive...</div>;
  }

  return <ScanResult result={result} />;
}
