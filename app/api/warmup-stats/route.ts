import { NextRequest, NextResponse } from "next/server";
import { fetchWarmupStats } from "@/lib/plusvibe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const startDate =
      searchParams.get("start_date") ||
      thirtyDaysAgo.toISOString().split("T")[0];
    const endDate =
      searchParams.get("end_date") || now.toISOString().split("T")[0];

    const stats = await fetchWarmupStats(startDate, endDate);

    if (!stats) {
      return NextResponse.json({
        stats: null,
        message: "Warmup stats not available. Check API key configuration.",
        lastUpdated: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      stats,
      dateRange: { startDate, endDate },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to fetch warmup stats:", error);
    return NextResponse.json(
      { error: "Failed to load warmup stats" },
      { status: 500 }
    );
  }
}
