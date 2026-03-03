import { NextRequest, NextResponse } from "next/server";
import { fetchWeeklyReport } from "@/lib/plusvibe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weeksParam = searchParams.get("weeks");
    const numWeeks = weeksParam ? Math.min(Math.max(parseInt(weeksParam, 10), 1), 52) : 12;

    const weeks = await fetchWeeklyReport(numWeeks);

    const totals = weeks.reduce(
      (acc, w) => ({
        sent: acc.sent + w.sent,
        replies: acc.replies + w.replies,
        bounces: acc.bounces + w.bounces,
        positiveReplies: acc.positiveReplies + w.positiveReplies,
        leadsContacted: acc.leadsContacted + w.leadsContacted,
        newLeadsContacted: acc.newLeadsContacted + w.newLeadsContacted,
        unsubscribes: acc.unsubscribes + w.unsubscribes,
      }),
      {
        sent: 0,
        replies: 0,
        bounces: 0,
        positiveReplies: 0,
        leadsContacted: 0,
        newLeadsContacted: 0,
        unsubscribes: 0,
      }
    );

    return NextResponse.json({
      weeks,
      totals: {
        ...totals,
        replyRate: totals.sent > 0 ? (totals.replies / totals.sent) * 100 : 0,
        bounceRate: totals.sent > 0 ? (totals.bounces / totals.sent) * 100 : 0,
      },
      numWeeks,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to fetch weekly report:", error);
    return NextResponse.json(
      { error: "Failed to load weekly report" },
      { status: 500 }
    );
  }
}
