import type { Campaign, CampaignSummary } from "./seed-data";

const PLUSVIBE_BASE_URL = "https://api.plusvibe.ai/api/v1";

function getApiKey(): string | null {
  const key = process.env.PLUSVIBE_API_KEY;
  if (!key || key === "your_plusvibe_api_key_here") return null;
  return key;
}

function getWorkspaceId(): string {
  return process.env.PLUSVIBE_WORKSPACE_ID || "69713f71c8231d9c2fd7b3aa";
}

async function plusvibeGet<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[PlusVibe] No API key configured, using seed data");
    return null;
  }

  const url = new URL(`${PLUSVIBE_BASE_URL}${endpoint}`);
  url.searchParams.set("workspace_id", getWorkspaceId());
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
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

// -- Campaign data (read-only) --

interface PlusVibeCampaign {
  id: string;
  camp_name: string;
  status: string;
  created_at: string;
  modified_at: string;
  sent_count: number;
  replied_count: number;
  bounced_count: number;
  positive_reply_count: number;
  negative_reply_count: number;
  neutral_reply_count: number;
  lead_count: number;
  completed_lead_count: number;
  lead_contacted_count: number;
  replied_rate: number;
  open_rate: number;
  camp_st_date: string;
  camp_end_date: string;
  last_lead_sent: string;
  sequence_steps: number;
  email_accounts: string[];
  daily_limit: number;
}

function mapPlusVibeCampaign(pv: PlusVibeCampaign): Campaign {
  const sent = pv.sent_count || 0;
  const replies = pv.replied_count || 0;
  const bounces = pv.bounced_count || 0;

  return {
    id: pv.id,
    name: pv.camp_name,
    status: normalizeStatus(pv.status),
    sent,
    replies,
    replyRate: sent > 0 ? (replies / sent) * 100 : 0,
    bounces,
    bounceRate: sent > 0 ? (bounces / sent) * 100 : 0,
    positiveReplies: pv.positive_reply_count || 0,
    startDate: pv.created_at || pv.camp_st_date || new Date().toISOString(),
    lastActivity:
      pv.last_lead_sent || pv.modified_at || new Date().toISOString(),
  };
}

function normalizeStatus(
  status: string
): "ACTIVE" | "PAUSED" | "COMPLETED" {
  const upper = (status || "").toUpperCase();
  if (upper === "ACTIVE") return "ACTIVE";
  if (upper === "PAUSED") return "PAUSED";
  if (upper === "COMPLETED") return "COMPLETED";
  if (upper === "ARCHIVED") return "COMPLETED";
  return "PAUSED";
}

export async function fetchCampaigns(): Promise<{
  campaigns: Campaign[];
  source: "api";
}> {
  const raw = await plusvibeGet<PlusVibeCampaign[]>("/campaign/list-all", {
    limit: "100",
    campaign_type: "parent",
  });

  if (raw && Array.isArray(raw) && raw.length > 0) {
    console.log(`[PlusVibe] Loaded ${raw.length} campaigns from API`);
    return { campaigns: raw.map(mapPlusVibeCampaign), source: "api" };
  }

  console.log("[PlusVibe] No campaigns available from API");
  return { campaigns: [], source: "api" };
}

export async function fetchCampaignSummary(
  campaignList?: Campaign[]
): Promise<CampaignSummary> {
  const list = campaignList || (await fetchCampaigns()).campaigns;
  const totalSent = list.reduce((s, c) => s + c.sent, 0);
  const totalReplies = list.reduce((s, c) => s + c.replies, 0);
  const totalBounces = list.reduce((s, c) => s + c.bounces, 0);
  const totalPositiveReplies = list.reduce(
    (s, c) => s + c.positiveReplies,
    0
  );

  return {
    totalSent,
    totalReplies,
    averageReplyRate: totalSent > 0 ? (totalReplies / totalSent) * 100 : 0,
    totalBounces,
    overallBounceRate: totalSent > 0 ? (totalBounces / totalSent) * 100 : 0,
    totalPositiveReplies,
    activeCampaigns: list.filter((c) => c.status === "ACTIVE").length,
    pausedCampaigns: list.filter((c) => c.status === "PAUSED").length,
    completedCampaigns: list.filter((c) => c.status === "COMPLETED").length,
  };
}

// -- Email accounts (read-only) --

export interface EmailAccount {
  id: string;
  email: string;
  status: string;
  warmupStatus: string;
  provider: string;
  firstName: string;
  lastName: string;
  dailyLimit: number;
  sendingGap: number;
  warmupLimit: number;
  warmupIncrement: number;
  warmupReplyRate: number;
  healthScores: {
    overall7d: number;
    google7d: number;
    microsoft7d: number;
    other7d: number;
    missRate1d: number;
    bounceRate3d: number;
  };
  replyRates: {
    ooo7d: number;
    regular7d: number;
  };
  dailyCounters: {
    emailSentToday: number;
    warmupSentToday: number;
  };
  tags: string[];
  campaignIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface PlusVibeAccountResponse {
  accounts: Array<{
    _id?: string;
    id?: string;
    email: string;
    status: string;
    warmup_status: string;
    provider: string;
    timestamp_created: string;
    timestamp_updated: string;
    warmup_enb_dt?: string;
    payload: {
      name: { first_name: string; last_name: string };
      warmup: {
        limit: number;
        increment: number;
        reply_rate: number;
        warmup_custom_words?: string;
        warmup_signature?: number;
        advanced?: {
          warm_ctd?: boolean;
          weekday_only?: boolean;
          warmup_business_type?: string;
        };
      };
      daily_limit: number;
      sending_gap: number;
      reply_to?: string;
      custom_domain?: string;
      signature?: string;
      tags: string[];
      cmps: string[];
      analytics: {
        health_scores: {
          "7d_overall_warmup_health": number;
          "7d_google_warmup_health": number;
          "7d_microsoft_warmup_health": number;
          "7d_other_warmup_health": number;
          "1d_miss_warmup_rate": number;
          "3d_bounce_rate": number;
        };
        reply_rates: {
          "7d_ooo_replyrate": number;
          "7d_replyrate": number;
        };
        daily_counters: {
          email_sent_today: number;
          warmup_email_sent_today: number;
        };
      };
    };
  }>;
}

function mapEmailAccount(
  raw: PlusVibeAccountResponse["accounts"][number]
): EmailAccount {
  const p = raw.payload;
  const hs = p.analytics?.health_scores;
  const rr = p.analytics?.reply_rates;
  const dc = p.analytics?.daily_counters;

  return {
    id: raw._id || raw.id || "",
    email: raw.email,
    status: raw.status,
    warmupStatus: raw.warmup_status,
    provider: raw.provider,
    firstName: p.name?.first_name || "",
    lastName: p.name?.last_name || "",
    dailyLimit: p.daily_limit || 0,
    sendingGap: p.sending_gap || 0,
    warmupLimit: p.warmup?.limit || 0,
    warmupIncrement: p.warmup?.increment || 0,
    warmupReplyRate: p.warmup?.reply_rate || 0,
    healthScores: {
      overall7d: hs?.["7d_overall_warmup_health"] ?? -1,
      google7d: hs?.["7d_google_warmup_health"] ?? -1,
      microsoft7d: hs?.["7d_microsoft_warmup_health"] ?? -1,
      other7d: hs?.["7d_other_warmup_health"] ?? -1,
      missRate1d: hs?.["1d_miss_warmup_rate"] ?? -1,
      bounceRate3d: hs?.["3d_bounce_rate"] ?? -1,
    },
    replyRates: {
      ooo7d: rr?.["7d_ooo_replyrate"] ?? -1,
      regular7d: rr?.["7d_replyrate"] ?? -1,
    },
    dailyCounters: {
      emailSentToday: dc?.email_sent_today ?? 0,
      warmupSentToday: dc?.warmup_email_sent_today ?? 0,
    },
    tags: p.tags || [],
    campaignIds: p.cmps || [],
    createdAt: raw.timestamp_created,
    updatedAt: raw.timestamp_updated,
  };
}

export async function fetchEmailAccounts(): Promise<EmailAccount[]> {
  const raw = await plusvibeGet<PlusVibeAccountResponse>("/account/list", {
    limit: "200",
  });

  if (raw?.accounts && Array.isArray(raw.accounts)) {
    console.log(
      `[PlusVibe] Loaded ${raw.accounts.length} email accounts from API`
    );
    return raw.accounts.map(mapEmailAccount);
  }

  console.log("[PlusVibe] No email accounts available from API");
  return [];
}

// -- Warmup stats (read-only) --

export interface WarmupStats {
  googlePercent: string;
  microsoftPercent: string;
  otherPercent: string;
  inboxPercent: string;
  spamPercent: string;
  promotionPercent: string;
  totalInboxSent: number;
  totalSpamSent: number;
  totalPromotionSent: number;
  totalWarmupSent: number;
  totalInboxes: number;
  totalDomains: number;
  chartData: Array<{
    date: string;
    dt: string;
    inbox: number;
    spam: number;
    promotion: number;
    sent: number;
  }>;
  emailDomainDetail: Record<string, number>;
}

interface PlusVibeWarmupResponse {
  status: string;
  emailAcc: {
    google_percent: string;
    microsoft_percent: string;
    other_percent: string;
    inbox_percent: string;
    spam_percent: string;
    promotion_percent: string;
    total_inbox_sent: number;
    total_spam_sent: number;
    total_promotion_sent: number;
    total_warmup_sent: number;
    total_inboxes: number;
    total_domains: number;
    chart_data: Array<{
      date: string;
      dt: string;
      inbox: number;
      spam: number;
      promotion: number;
      sent: number;
    }>;
    email_domain_detail: Record<string, number>;
  };
}

// -- Weekly report stats (read-only) --

interface AggregatedStats {
  lead_count: number;
  completed_lead_count: number;
  lead_contacted_count: number;
  new_completed_lead_count: number;
  new_lead_contacted_count: number;
  sent_count: number;
  unique_opened_count: number;
  replied_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  positive_reply_count: number;
  opportunity_val: number;
  opportunity_val_per_count: number;
}

export interface WeeklyReportRow {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  sent: number;
  replies: number;
  bounces: number;
  positiveReplies: number;
  leadsContacted: number;
  newLeadsContacted: number;
  unsubscribes: number;
  replyRate: number;
  bounceRate: number;
}

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDateParam(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatWeekLabel(start: Date): string {
  return start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function fetchWeeklyReport(
  numWeeks: number = 12
): Promise<WeeklyReportRow[]> {
  const now = new Date();
  const currentMonday = getMonday(now);

  const weeks: { start: Date; end: Date }[] = [];
  for (let i = numWeeks - 1; i >= 0; i--) {
    const start = new Date(currentMonday);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    if (end > now) {
      end.setTime(now.getTime());
    }
    weeks.push({ start, end });
  }

  const results: WeeklyReportRow[] = [];

  for (const week of weeks) {
    const raw = await plusvibeGet<AggregatedStats>("/campaign/stats/all", {
      start_date: formatDateParam(week.start),
      end_date: formatDateParam(week.end),
    });

    results.push({
      weekStart: formatDateParam(week.start),
      weekEnd: formatDateParam(week.end),
      weekLabel: formatWeekLabel(week.start),
      sent: raw?.sent_count ?? 0,
      replies: raw?.replied_count ?? 0,
      bounces: raw?.bounced_count ?? 0,
      positiveReplies: raw?.positive_reply_count ?? 0,
      leadsContacted: raw?.lead_contacted_count ?? 0,
      newLeadsContacted: raw?.new_lead_contacted_count ?? 0,
      unsubscribes: raw?.unsubscribed_count ?? 0,
      replyRate:
        raw && raw.sent_count > 0
          ? (raw.replied_count / raw.sent_count) * 100
          : 0,
      bounceRate:
        raw && raw.sent_count > 0
          ? (raw.bounced_count / raw.sent_count) * 100
          : 0,
    });
  }

  return results;
}

export async function fetchWarmupStats(
  startDate: string,
  endDate: string
): Promise<WarmupStats | null> {
  const raw = await plusvibeGet<PlusVibeWarmupResponse>(
    "/account/warmup-stats",
    { start_date: startDate, end_date: endDate }
  );

  if (!raw?.emailAcc) return null;

  const ea = raw.emailAcc;
  return {
    googlePercent: ea.google_percent || "0",
    microsoftPercent: ea.microsoft_percent || "0",
    otherPercent: ea.other_percent || "0",
    inboxPercent: ea.inbox_percent || "0",
    spamPercent: ea.spam_percent || "0",
    promotionPercent: ea.promotion_percent || "0",
    totalInboxSent: ea.total_inbox_sent || 0,
    totalSpamSent: ea.total_spam_sent || 0,
    totalPromotionSent: ea.total_promotion_sent || 0,
    totalWarmupSent: ea.total_warmup_sent || 0,
    totalInboxes: ea.total_inboxes || 0,
    totalDomains: ea.total_domains || 0,
    chartData: ea.chart_data || [],
    emailDomainDetail: ea.email_domain_detail || {},
  };
}
