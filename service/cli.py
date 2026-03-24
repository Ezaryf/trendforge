from __future__ import annotations

import argparse
import json

from engine import compare, explore, scan


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="TrendForge forecasting CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    scan_parser = subparsers.add_parser("scan")
    scan_parser.add_argument("--repo", required=True)
    scan_parser.add_argument("--horizon", default="30d")

    explore_parser = subparsers.add_parser("explore")
    explore_parser.add_argument("--horizon", default="30d")
    explore_parser.add_argument("--category")

    compare_parser = subparsers.add_parser("compare")
    compare_parser.add_argument("--repo", required=True)
    compare_parser.add_argument("--other", required=True)
    compare_parser.add_argument("--horizon", default="30d")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "scan":
        payload = scan(args.repo, args.horizon)
    elif args.command == "explore":
        payload = explore(args.horizon, args.category)
    else:
        payload = compare(args.repo, args.other, args.horizon)

    print(json.dumps(payload))


if __name__ == "__main__":
    main()
