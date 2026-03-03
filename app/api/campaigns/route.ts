import { NextResponse } from "next/server";
import { fetchCampaigns, fetchCampaignSummary } from "@/lib/plusvibe";
import {
  weeklyVolume,
  getBestPerformingCampaign,
  getHighBounceCampaigns,
} from "@/lib/seed-data";

export async function GET() {
  try {
    const [campaignList, summary] = await Promise.all([
      fetchCampaigns(),
      fetchCampaignSummary(),
    ]);

    const bestCampaign = getBestPerformingCampaign();
    const highBounceCampaigns = getHighBounceCampaigns();

    return NextResponse.json({
      campaigns: campaignList,
      summary,
      weeklyVolume,
      insights: {
        bestPerforming: {
          name: bestCampaign.name,
          replyRate: bestCampaign.replyRate,
          replies: bestCampaign.replies,
          sent: bestCampaign.sent,
        },
        needsAttention: highBounceCampaigns.slice(0, 3).map((c) => ({
          name: c.name,
          bounceRate: c.bounceRate,
          bounces: c.bounces,
          status: c.status,
        })),
        narrative: generateNarrative(summary),
      },
      source: "seed",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Failed to fetch campaign data:", error);
    return NextResponse.json(
      { error: "Failed to load campaign data" },
      { status: 500 }
    );
  }
}

function generateNarrative(summary: {
  totalSent: number;
  totalReplies: number;
  averageReplyRate: number;
  totalPositiveReplies: number;
  activeCampaigns: number;
  totalBounces: number;
  overallBounceRate: number;
}): string {
  const parts: string[] = [];

  parts.push(
    `Across ${summary.activeCampaigns} active campaigns, ${summary.totalSent.toLocaleString()} emails have been sent with a ${summary.averageReplyRate.toFixed(1)}% overall reply rate.`
  );

  parts.push(
    `${summary.totalReplies.toLocaleString()} total replies received, ${summary.totalPositiveReplies} of which are positive (meetings booked or expressed interest).`
  );

  if (summary.overallBounceRate > 5) {
    parts.push(
      `Overall bounce rate is ${summary.overallBounceRate.toFixed(1)}%, which is elevated. Consider reviewing list quality on high-bounce campaigns.`
    );
  } else {
    parts.push(
      `Bounce rate of ${summary.overallBounceRate.toFixed(1)}% is within acceptable range.`
    );
  }

  return parts.join(" ");
}
