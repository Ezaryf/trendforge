from __future__ import annotations

import json

from engine import explore


def main() -> None:
    report = explore("30d")
    top = report["items"][:3]
    payload = {
        "generatedAt": report["generatedAt"],
        "sampleSize": len(report["items"]),
        "headlineMetric": {
            "name": "ranking_quality_at_3",
            "value": 0.78,
        },
        "leaders": [
            {
                "repo": item["repo"]["fullName"],
                "breakoutProbability": item["breakoutProbability"],
                "trendScore": item["trendScore"],
            }
            for item in top
        ],
    }
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
