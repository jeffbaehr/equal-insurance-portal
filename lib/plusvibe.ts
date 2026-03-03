import {
  campaigns,
  type Campaign,
  type CampaignSummary,
  getCampaignSummary,
} from "./seed-data";

const PLUSVIBE_BASE_URL = "https://api.plusvibe.ai/api/v1";

interface PlusVibeWorkspace {
  _id: string;
  name: string;
  [key: string]: unknown;
}

async function plusvibeFetch<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.PLUSVIBE_API_KEY;
  if (!apiKey || apiKey === "your_plusvibe_api_key_here") {
    console.warn("[PlusVibe] No API key configured, using seed data");
    return null;
  }

  try {
    const response = await fetch(`${PLUSVIBE_BASE_URL}${endpoint}`, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(
        `[PlusVibe] API returned ${response.status} for ${endpoint}`
      );
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[PlusVibe] API error for ${endpoint}:`, error);
    return null;
  }
}

export async function getWorkspaces(): Promise<PlusVibeWorkspace[] | null> {
  return plusvibeFetch<PlusVibeWorkspace[]>("/workspaces");
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const workspaceId =
    process.env.PLUSVIBE_WORKSPACE_ID || "69713f71c8231d9c2fd7b3aa";

  const apiCampaigns = await plusvibeFetch<Campaign[]>(
    `/workspaces/${workspaceId}/campaigns`
  );

  if (
    apiCampaigns &&
    Array.isArray(apiCampaigns) &&
    apiCampaigns.length > 0
  ) {
    console.log(
      `[PlusVibe] Loaded ${apiCampaigns.length} campaigns from API`
    );
    return apiCampaigns;
  }

  const altCampaigns = await plusvibeFetch<Campaign[]>(
    `/workspaces/${workspaceId}/sequences`
  );

  if (
    altCampaigns &&
    Array.isArray(altCampaigns) &&
    altCampaigns.length > 0
  ) {
    console.log(
      `[PlusVibe] Loaded ${altCampaigns.length} campaigns from sequences endpoint`
    );
    return altCampaigns;
  }

  console.log("[PlusVibe] Using seed data (API endpoints not yet available)");
  return campaigns;
}

export async function fetchCampaignSummary(): Promise<CampaignSummary> {
  const workspaceId =
    process.env.PLUSVIBE_WORKSPACE_ID || "69713f71c8231d9c2fd7b3aa";

  const apiStats = await plusvibeFetch<CampaignSummary>(
    `/workspaces/${workspaceId}/stats`
  );

  if (apiStats && typeof apiStats.totalSent === "number") {
    return apiStats;
  }

  return getCampaignSummary();
}
