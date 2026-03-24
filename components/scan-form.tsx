"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { Horizon } from "@/lib/types";

const placeholders = [
  "https://github.com/vercel/next.js",
  "https://github.com/anthropics/anthropic-cookbook",
  "https://github.com/microsoft/markitdown",
];

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState(placeholders[0]);
  const [horizon, setHorizon] = useState<Horizon>("30d");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="scan-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!repoUrl.trim()) return;
        const target = `/repo/scan?repo=${encodeURIComponent(repoUrl)}&horizon=${horizon}`;
        startTransition(() => router.push(target));
      }}
    >
      <input
        aria-label="Repository URL"
        className="field"
        value={repoUrl}
        onChange={(event) => setRepoUrl(event.target.value)}
        placeholder={compact ? "Paste GitHub repository URL" : placeholders[0]}
      />
      <select
        aria-label="Forecast horizon"
        className="select"
        value={horizon}
        onChange={(event) => setHorizon(event.target.value as Horizon)}
      >
        <option value="7d">7d</option>
        <option value="30d">30d</option>
        <option value="90d">90d</option>
      </select>
      <button className="button" type="submit" disabled={isPending}>
        {isPending ? "Scanning..." : "Scan Repo"}
      </button>
    </form>
  );
}
