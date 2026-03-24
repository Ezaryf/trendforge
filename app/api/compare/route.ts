import { NextRequest, NextResponse } from "next/server";

import { compareRepos } from "@/lib/python-service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      repoUrl?: string;
      otherRepoUrl?: string;
      horizon?: string;
    };

    if (!body.repoUrl || !body.otherRepoUrl) {
      return NextResponse.json({ error: "Both repoUrl and otherRepoUrl are required" }, { status: 400 });
    }

    const result = await compareRepos(body.repoUrl, body.otherRepoUrl, body.horizon ?? "30d");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Comparison failed unexpectedly" },
      { status: 500 },
    );
  }
}
