import { NextResponse } from "next/server";
import { fetchCampaigns, fetchCampaignSummary } from "@/lib/plusvibe";
import { weeklyVolume } from "@/lib/seed-data";
import type { Campaign, CampaignSummary } from "@/lib/seed-data";

export async function GET() {
  try {
    const { campaigns: campaignList, source } = await fetchCampaigns();
    const summary = await fetchCampaignSummary(campaignList);

    const bestCampaign = campaignList.reduce(
      (best, c) => (c.replyRate > best.replyRate ? c : best),
      campaignList[0]
    );

    const highBounceCampaigns = campaignList
      .filter((c) => c.bounceRate > 8)
      .sort((a, b) => b.bounceRate - a.bounceRate);

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
      source,
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

function generateNarrative(summary: CampaignSummary): string {
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
