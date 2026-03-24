# TrendForge

TrendForge is a portfolio-grade MVP for forecasting which GitHub repositories are most likely to break out over the next `7d`, `30d`, or `90d`.

## What is included

- A cinematic Next.js frontend for scan, explore, compare, and deep-dive flows.
- A lightweight Python forecasting engine that collects GitHub metadata, derives momentum signals, and returns explainable forecasts.
- API routes that bridge the frontend to the Python service through a local CLI.
- A small backtest script and Python unit tests for the core forecast contract.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the frontend:

```bash
npm run dev
```

3. Optional: run the standalone Python HTTP service:

```bash
npm run service
```

The Next.js app works without the standalone service because it invokes the Python CLI directly for each request.

## Test and evaluate

```bash
npm test
npm run backtest
```

## Notes

- The MVP focuses on GitHub repos only.
- Live GitHub API requests are attempted first; when unavailable, the engine falls back to seeded repository profiles so the demo remains usable.
- Setting `GITHUB_TOKEN` improves API headroom for live scans.
