import { NextResponse } from "next/server";
import { fetchCampaigns, fetchCampaignSummary } from "@/lib/plusvibe";

export async function GET() {
  try {
    const { campaigns: campaignList, source } = await fetchCampaigns();
    const summary = await fetchCampaignSummary(campaignList);

    return NextResponse.json({
      campaigns: campaignList,
      summary,
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
