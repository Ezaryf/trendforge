import { NextRequest, NextResponse } from "next/server";

import { exploreRepos } from "@/lib/python-service";

export async function GET(request: NextRequest) {
  try {
    const horizon = request.nextUrl.searchParams.get("horizon") ?? "30d";
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const result = await exploreRepos(horizon, category);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Explore failed unexpectedly" },
      { status: 500 },
    );
  }
}
