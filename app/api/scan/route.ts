import { NextRequest, NextResponse } from "next/server";

import { scanRepo } from "@/lib/python-service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { repoUrl?: string; horizon?: string };
    if (!body.repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const result = await scanRepo(body.repoUrl, body.horizon ?? "30d");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scan failed unexpectedly" },
      { status: 500 },
    );
  }
}
