import { NextResponse } from "next/server";
import { fetchEmailAccounts } from "@/lib/plusvibe";

export async function GET() {
  try {
    const accounts = await fetchEmailAccounts();

    const summary = {
      total: accounts.length,
      active: accounts.filter((a) => a.status === "ACTIVE").length,
      paused: accounts.filter(
        (a) => a.status === "PAUSED" || a.status === "INACTIVE"
      ).length,
      warmupActive: accounts.filter((a) => a.warmupStatus === "ACTIVE").length,
      warmupPaused: accounts.filter(
        (a) => a.warmupStatus === "PAUSED" || a.warmupStatus === "INACTIVE"
      ).length,
      avgHealthScore:
        accounts.length > 0
          ? accounts.reduce(
              (sum, a) =>
                sum +
                (a.healthScores.overall7d >= 0
                  ? a.healthScores.overall7d
                  : 0),
              0
            ) /
            accounts.filter((a) => a.healthScores.overall7d >= 0).length
          : 0,
      totalSentToday: accounts.reduce(
        (sum, a) => sum + a.dailyCounters.emailSentToday,
        0
      ),
      totalWarmupSentToday: accounts.reduce(
        (sum, a) => sum + a.dailyCounters.warmupSentToday,
        0
      ),
      providers: {
        google: accounts.filter(
          (a) =>
            a.provider === "GOOGLE_WORKSPACE" || a.provider === "GOOGLE"
        ).length,
        microsoft: accounts.filter(
          (a) =>
            a.provider === "MICROSOFT365" || a.provider === "MICROSOFT"
        ).length,
        other: accounts.filter(
          (a) =>
            a.provider !== "GOOGLE_WORKSPACE" &&
            a.provider !== "GOOGLE" &&
            a.provider !== "MICROSOFT365" &&
            a.provider !== "MICROSOFT"
        ).length,
      },
    };

    return NextResponse.json({
      accounts,
      summary,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to fetch email accounts:", error);
    return NextResponse.json(
      { error: "Failed to load email accounts" },
      { status: 500 }
    );
  }
}
