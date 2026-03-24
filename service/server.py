from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from engine import compare, explore, scan


class TrendForgeHandler(BaseHTTPRequestHandler):
    def _send(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/explore":
            self._send({"error": "Not found"}, 404)
            return
        query = parse_qs(parsed.query)
        payload = explore(query.get("horizon", ["30d"])[0], query.get("category", [None])[0])
        self._send(payload)

    def do_POST(self) -> None:
        length = int(self.headers.get("Content-Length", "0"))
        body = json.loads(self.rfile.read(length) or "{}")
        try:
            if self.path == "/scan":
                payload = scan(body["repoUrl"], body.get("horizon", "30d"))
            elif self.path == "/compare":
                payload = compare(body["repoUrl"], body["otherRepoUrl"], body.get("horizon", "30d"))
            else:
                self._send({"error": "Not found"}, 404)
                return
        except (KeyError, ValueError) as error:
            self._send({"error": str(error)}, 400)
            return
        self._send(payload)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8001), TrendForgeHandler)
    print("TrendForge service listening on http://127.0.0.1:8001")
    server.serve_forever()
