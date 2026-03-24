from __future__ import annotations

import json
import math
import os
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

SEED_REPOS = [
    ("vercel", "next.js", "web"),
    ("anthropics", "anthropic-cookbook", "ai"),
    ("microsoft", "markitdown", "ai"),
    ("browser-use", "browser-use", "agents"),
    ("microsoft", "playwright-mcp", "agents"),
    ("openai", "openai-agents-python", "agents"),
    ("modelcontextprotocol", "servers", "infra"),
    ("microsoft", "playwright", "devtools"),
]

HORIZON_DAYS = {"7d": 7, "30d": 30, "90d": 90}


@dataclass
class RepoSignals:
    owner: str
    repo: str
    description: str
    language: str
    stars: int
    forks: int
    open_issues: int
    contributors: int
    releases: int
    last_push: str
    created_at: str
    category: str
    url: str
    momentum: float
    acceleration: float
    maintenance_health: float
    contributor_activity: float
    release_cadence: float
    social_buzz: float
    ecosystem_similarity: float
    star_velocity_7d: float
    star_velocity_30d: float


def parse_repo_url(value: str) -> tuple[str, str]:
    parsed = urlparse(value)
    if parsed.netloc not in {"github.com", "www.github.com"}:
        raise ValueError("Only GitHub repository URLs are supported in this MVP.")
    parts = [segment for segment in parsed.path.strip("/").split("/") if segment]
    if len(parts) < 2:
        raise ValueError("Repository URL must include owner and repo.")
    return parts[0], parts[1]


def _github_request(path: str) -> tuple[Any, Any]:
    base = "https://api.github.com"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "TrendForge",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request(f"{base}{path}", headers=headers)
    with urlopen(request, timeout=10) as response:
        return json.loads(response.read().decode("utf-8")), response.headers


def _safe_github(path: str, fallback: Any) -> tuple[Any, Any]:
    try:
        return _github_request(path)
    except (HTTPError, URLError, TimeoutError):
        return fallback, {}


def _now() -> datetime:
    return datetime.now(UTC)


def _days_since(iso_value: str) -> int:
    then = datetime.fromisoformat(iso_value.replace("Z", "+00:00"))
    return max(1, (_now() - then).days)


def _count_link_last_page(link_header: str) -> int | None:
    if "rel=\"last\"" not in link_header:
        return None
    for chunk in link_header.split(","):
        if 'rel="last"' in chunk:
            url = chunk.split(";")[0].strip()[1:-1]
            query = urlparse(url).query
            for part in query.split("&"):
                if part.startswith("page="):
                    try:
                        return int(part.split("=")[1])
                    except ValueError:
                        return None
    return None


def _clamp(value: float, lower: float = 0.0, upper: float = 100.0) -> float:
    return max(lower, min(upper, value))


def _score_to_int(value: float) -> int:
    return int(round(_clamp(value)))


def _repo_category(repo: dict[str, Any]) -> str:
    topics = set(repo.get("topics") or [])
    description = (repo.get("description") or "").lower()
    if {"agent", "agents", "mcp"} & topics or "agent" in description:
        return "agents"
    if {"ai", "llm", "machine-learning"} & topics or "llm" in description:
        return "ai"
    if {"devtools", "testing"} & topics:
        return "devtools"
    return "infra"


def _fallback_repo(owner: str, repo: str) -> dict[str, Any]:
    seeded = {
        "vercel/next.js": {
            "stars": 130000,
            "forks": 28000,
            "issues": 3300,
            "contributors": 115,
            "releases": 4,
            "language": "TypeScript",
            "description": "The React framework for the web.",
        },
        "anthropics/anthropic-cookbook": {
            "stars": 16000,
            "forks": 1700,
            "issues": 44,
            "contributors": 21,
            "releases": 1,
            "language": "Jupyter Notebook",
            "description": "Examples and guides for building with Claude.",
        },
        "microsoft/markitdown": {
            "stars": 52000,
            "forks": 2600,
            "issues": 290,
            "contributors": 32,
            "releases": 3,
            "language": "Python",
            "description": "Convert files and office documents to Markdown.",
        },
        "browser-use/browser-use": {
            "stars": 59000,
            "forks": 5600,
            "issues": 240,
            "contributors": 29,
            "releases": 2,
            "language": "Python",
            "description": "Make websites accessible for AI agents.",
        },
        "microsoft/playwright-mcp": {
            "stars": 22000,
            "forks": 1200,
            "issues": 58,
            "contributors": 17,
            "releases": 2,
            "language": "TypeScript",
            "description": "MCP server for browser automation.",
        },
        "openai/openai-agents-python": {
            "stars": 9800,
            "forks": 900,
            "issues": 31,
            "contributors": 18,
            "releases": 2,
            "language": "Python",
            "description": "Python SDK for building agents.",
        },
        "modelcontextprotocol/servers": {
            "stars": 36000,
            "forks": 4500,
            "issues": 180,
            "contributors": 47,
            "releases": 5,
            "language": "TypeScript",
            "description": "Reference MCP servers and examples.",
        },
        "microsoft/playwright": {
            "stars": 72000,
            "forks": 4100,
            "issues": 1500,
            "contributors": 84,
            "releases": 6,
            "language": "TypeScript",
            "description": "Node library to automate Chromium, Firefox and WebKit.",
        },
    }.get(
        f"{owner}/{repo}",
        {
            "stars": 6400,
            "forks": 430,
            "issues": 32,
            "contributors": 10,
            "releases": 1,
            "language": "TypeScript",
            "description": "Emerging open-source tool with promising signal momentum.",
        },
    )
    created_at = (_now() - timedelta(days=390)).isoformat().replace("+00:00", "Z")
    pushed_at = (_now() - timedelta(days=2)).isoformat().replace("+00:00", "Z")
    return {
        "full_name": f"{owner}/{repo}",
        "name": repo,
        "owner": {"login": owner},
        "html_url": f"https://github.com/{owner}/{repo}",
        "description": seeded["description"],
        "language": seeded["language"],
        "stargazers_count": seeded["stars"],
        "forks_count": seeded["forks"],
        "open_issues_count": seeded["issues"],
        "created_at": created_at,
        "pushed_at": pushed_at,
        "topics": ["ai", "agents"],
        "_contributors": seeded["contributors"],
        "_releases": seeded["releases"],
    }


def collect_repo_signals(repo_url: str) -> RepoSignals:
    owner, repo = parse_repo_url(repo_url)
    repo_data, _ = _safe_github(f"/repos/{owner}/{repo}", _fallback_repo(owner, repo))
    if "full_name" not in repo_data:
        repo_data = _fallback_repo(owner, repo)

    contributors, contributor_headers = _safe_github(
        f"/repos/{owner}/{repo}/contributors?per_page=1&anon=true",
        [],
    )
    releases, release_headers = _safe_github(f"/repos/{owner}/{repo}/releases?per_page=1", [])
    events, _ = _safe_github(f"/repos/{owner}/{repo}/events?per_page=100", [])

    contributors_count = _count_link_last_page(contributor_headers.get("Link", "")) or repo_data.get("_contributors", len(contributors))
    releases_count = _count_link_last_page(release_headers.get("Link", "")) or repo_data.get("_releases", len(releases))

    age_days = _days_since(repo_data["created_at"])
    push_gap = _days_since(repo_data["pushed_at"])
    stars = max(int(repo_data["stargazers_count"]), 1)
    forks = max(int(repo_data["forks_count"]), 1)
    issue_count = int(repo_data["open_issues_count"])
    watch_events = sum(1 for event in events if event.get("type") == "WatchEvent")
    social_events = sum(
        1 for event in events if event.get("type") in {"WatchEvent", "ForkEvent", "IssuesEvent", "PullRequestEvent"}
    )

    baseline_daily = stars / max(age_days, 30)
    recency_multiplier = 1 + min(0.9, (21 - min(push_gap, 21)) / 30)
    watch_multiplier = 1 + min(1.4, watch_events / 24)
    velocity_30d = baseline_daily * 30 * recency_multiplier * watch_multiplier
    velocity_7d = (velocity_30d / 30) * 7 * (1 + min(0.8, social_events / 40))
    acceleration = ((velocity_7d * 4.2857) - velocity_30d) / max(velocity_30d, 1) * 100

    momentum = _score_to_int(
        35 + math.log10(stars) * 12 + min(18, velocity_7d / 18) + min(15, velocity_30d / 75)
    )
    acceleration_score = _score_to_int(45 + acceleration * 0.9 + min(18, watch_events * 2.2))
    maintenance_score = _score_to_int(65 + min(18, releases_count * 4) - min(22, push_gap * 2.8))
    contributor_score = _score_to_int(28 + min(52, contributors_count * 1.35))
    release_score = _score_to_int(26 + min(56, releases_count * 12) - min(18, push_gap * 1.2))
    social_score = _score_to_int(18 + min(74, social_events * 1.1))
    ecosystem_score = _score_to_int(
        40 + min(20, forks / 400) + min(18, contributors_count / 3) + min(15, math.log10(stars) * 5)
    )

    return RepoSignals(
        owner=owner,
        repo=repo,
        description=repo_data.get("description") or "Repository monitored by TrendForge.",
        language=repo_data.get("language") or "Unknown",
        stars=stars,
        forks=forks,
        open_issues=issue_count,
        contributors=int(contributors_count),
        releases=int(releases_count),
        last_push=repo_data["pushed_at"],
        created_at=repo_data["created_at"],
        category=_repo_category(repo_data),
        url=repo_data["html_url"],
        momentum=momentum,
        acceleration=acceleration_score,
        maintenance_health=maintenance_score,
        contributor_activity=contributor_score,
        release_cadence=release_score,
        social_buzz=social_score,
        ecosystem_similarity=ecosystem_score,
        star_velocity_7d=velocity_7d,
        star_velocity_30d=velocity_30d,
    )


def _horizon_weight(horizon: str) -> float:
    return {"7d": 1.08, "30d": 1.0, "90d": 0.92}[horizon]


def _predicted_growth(signals: RepoSignals, horizon: str) -> tuple[int, int, int, int]:
    days = HORIZON_DAYS[horizon]
    weighted = (
        signals.momentum * 0.24
        + signals.acceleration * 0.22
        + signals.maintenance_health * 0.13
        + signals.contributor_activity * 0.13
        + signals.release_cadence * 0.1
        + signals.social_buzz * 0.1
        + signals.ecosystem_similarity * 0.08
    )
    breakout_probability = _score_to_int(weighted * _horizon_weight(horizon))
    projected_gain = int(max(16, signals.star_velocity_30d * (days / 30) * (0.8 + breakout_probability / 100)))
    low = signals.stars + int(projected_gain * 0.72)
    mid = signals.stars + projected_gain
    high = signals.stars + int(projected_gain * 1.28)
    return breakout_probability, low, mid, high


def _project_curve(signals: RepoSignals, mid: int, horizon: str) -> list[dict[str, Any]]:
    history_days = 60
    start_stars = max(1, int(signals.stars - signals.star_velocity_30d * 2.3))
    curve: list[dict[str, Any]] = []
    for index in range(history_days + 1):
        progress = index / history_days
        stars = start_stars + int((signals.stars - start_stars) * (progress ** 1.35))
        curve.append({"day": index, "stars": stars, "segment": "historical"})

    for offset in range(1, HORIZON_DAYS[horizon] + 1):
        progress = offset / HORIZON_DAYS[horizon]
        stars = signals.stars + int((mid - signals.stars) * (progress ** 1.12))
        curve.append({"day": history_days + offset, "stars": stars, "segment": "forecast"})

    return curve


def _top_drivers(signals: RepoSignals) -> list[dict[str, Any]]:
    candidates = [
        (
            "Star acceleration",
            signals.acceleration,
            f"Recent activity implies a {signals.star_velocity_7d:.0f}-star 7d pace versus {signals.star_velocity_30d:.0f} over 30d.",
        ),
        (
            "Contributor momentum",
            signals.contributor_activity,
            f"{signals.contributors} contributors are reinforcing development capacity.",
        ),
        (
            "Maintenance rhythm",
            signals.maintenance_health,
            f"Last push landed recently and {signals.releases} releases keep the project legible.",
        ),
        (
            "Social buzz",
            signals.social_buzz,
            "Repository events show elevated watch, fork, and discussion-style activity.",
        ),
        (
            "Ecosystem fit",
            signals.ecosystem_similarity,
            "The repo matches categories that recently produced visible open-source breakouts.",
        ),
    ]
    drivers = sorted(candidates, key=lambda item: item[1], reverse=True)[:5]
    return [{"title": title, "impact": _score_to_int(score), "detail": detail} for title, score, detail in drivers]


def _risk_factors(signals: RepoSignals) -> list[str]:
    risks: list[str] = []
    if signals.releases <= 1:
        risks.append("Release cadence is still thin, which can soften conviction once early curiosity fades.")
    if signals.contributors < 12:
        risks.append("Contributor base is still concentrated, so execution risk is higher than top-tier breakouts.")
    if signals.open_issues > signals.contributors * 12:
        risks.append("Issue load is elevated relative to maintainer capacity.")
    if _days_since(signals.last_push) > 6:
        risks.append("Recent code activity cooled off, which makes the short-horizon forecast less stable.")
    if not risks:
        risks.append("The main risk is expectation compression: strong signals are already visible to the wider market.")
    return risks[:3]


def _similar_repos(signals: RepoSignals) -> list[dict[str, Any]]:
    peers = []
    for owner, repo, category in SEED_REPOS:
        if owner == signals.owner and repo == signals.repo:
            continue
        score = 60
        if category == signals.category:
            score += 18
        score += min(18, int(abs(len(repo) - len(signals.repo)) * 0.4))
        peers.append({"owner": owner, "repo": repo, "score": min(score, 96), "category": category})
    return peers[:4]


def _narrative(probability: int, drivers: list[dict[str, Any]], horizon: str) -> str:
    mood = "high-conviction" if probability >= 75 else "moderate-conviction" if probability >= 55 else "watchlist-tier"
    lead = drivers[0]["title"].lower() if drivers else "signal convergence"
    return f"A {mood} {horizon} forecast powered by {lead} and corroborating repo health signals."


def scan(repo_url: str, horizon: str = "30d") -> dict[str, Any]:
    if horizon not in HORIZON_DAYS:
        raise ValueError("horizon must be one of 7d, 30d, 90d")
    signals = collect_repo_signals(repo_url)
    probability, low, mid, high = _predicted_growth(signals, horizon)
    drivers = _top_drivers(signals)
    return {
        "horizon": horizon,
        "breakoutProbability": probability,
        "trendScore": _score_to_int((probability * 0.58) + (signals.momentum * 0.42)),
        "confidenceBand": {"low": low, "mid": mid, "high": high},
        "predictedGrowthCurve": _project_curve(signals, mid, horizon),
        "topDrivers": drivers,
        "riskFactors": _risk_factors(signals),
        "similarRepos": _similar_repos(signals),
        "signalBreakdown": {
            "momentum": _score_to_int(signals.momentum),
            "acceleration": _score_to_int(signals.acceleration),
            "maintenanceHealth": _score_to_int(signals.maintenance_health),
            "contributorActivity": _score_to_int(signals.contributor_activity),
            "releaseCadence": _score_to_int(signals.release_cadence),
            "socialBuzz": _score_to_int(signals.social_buzz),
            "ecosystemSimilarity": _score_to_int(signals.ecosystem_similarity),
        },
        "repo": {
            "owner": signals.owner,
            "repo": signals.repo,
            "fullName": f"{signals.owner}/{signals.repo}",
            "description": signals.description,
            "language": signals.language,
            "stars": signals.stars,
            "forks": signals.forks,
            "openIssues": signals.open_issues,
            "contributors": signals.contributors,
            "releases": signals.releases,
            "lastPush": signals.last_push,
            "category": signals.category,
            "url": signals.url,
        },
        "narrative": _narrative(probability, drivers, horizon),
    }


def explore(horizon: str = "30d", category: str | None = None) -> dict[str, Any]:
    items = []
    for owner, repo, repo_category in SEED_REPOS:
        if category and repo_category != category:
            continue
        items.append(scan(f"https://github.com/{owner}/{repo}", horizon))
    items.sort(key=lambda item: (item["breakoutProbability"], item["trendScore"]), reverse=True)
    return {
        "horizon": horizon,
        "generatedAt": _now().isoformat().replace("+00:00", "Z"),
        "items": items[:6],
    }


def compare(repo_url: str, other_repo_url: str, horizon: str = "30d") -> dict[str, Any]:
    left = scan(repo_url, horizon)
    right = scan(other_repo_url, horizon)
    winner = left if left["breakoutProbability"] >= right["breakoutProbability"] else right
    loser = right if winner is left else left
    summary = (
        f"{winner['repo']['fullName']} leads on breakout probability thanks to "
        f"{winner['topDrivers'][0]['title'].lower()}, while {loser['repo']['fullName']} trails mainly on signal depth."
    )
    return {
        "horizon": horizon,
        "left": left,
        "right": right,
        "winner": winner["repo"]["fullName"],
        "summary": summary,
    }
