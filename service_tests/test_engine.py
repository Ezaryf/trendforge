import unittest

from service.engine import HORIZON_DAYS, compare, parse_repo_url, scan


class EngineTests(unittest.TestCase):
    def test_parse_repo_url(self):
        owner, repo = parse_repo_url("https://github.com/vercel/next.js")
        self.assertEqual(owner, "vercel")
        self.assertEqual(repo, "next.js")

    def test_scan_contract(self):
        payload = scan("https://github.com/vercel/next.js", "30d")
        self.assertEqual(payload["horizon"], "30d")
        self.assertIn("breakoutProbability", payload)
        self.assertGreater(len(payload["predictedGrowthCurve"]), HORIZON_DAYS["30d"])
        self.assertEqual(payload["predictedGrowthCurve"][-1]["segment"], "forecast")

    def test_compare_contract(self):
        payload = compare("https://github.com/vercel/next.js", "https://github.com/microsoft/playwright", "7d")
        self.assertEqual(payload["horizon"], "7d")
        self.assertIn(payload["winner"], {payload["left"]["repo"]["fullName"], payload["right"]["repo"]["fullName"]})


if __name__ == "__main__":
    unittest.main()
