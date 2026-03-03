export interface Campaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  sent: number;
  replies: number;
  replyRate: number;
  bounces: number;
  bounceRate: number;
  positiveReplies: number;
  startDate: string;
  lastActivity: string;
}

export interface CampaignSummary {
  totalSent: number;
  totalReplies: number;
  averageReplyRate: number;
  totalBounces: number;
  overallBounceRate: number;
  totalPositiveReplies: number;
  activeCampaigns: number;
  pausedCampaigns: number;
  completedCampaigns: number;
}

export interface WeeklyVolume {
  week: string;
  sent: number;
  replies: number;
  bounces: number;
}

export const campaigns: Campaign[] = [
  {
    id: "equal-ma-1000-2000-seg",
    name: "Equal - M&A - 1000-2000 - SEG",
    status: "ACTIVE",
    sent: 9339,
    replies: 209,
    replyRate: 2.2,
    bounces: 277,
    bounceRate: 3.0,
    positiveReplies: 6,
    startDate: "2024-11-15",
    lastActivity: "2025-03-02",
  },
  {
    id: "equal-ma-1000-2000-ms-active",
    name: "Equal - M&A - 1000-2000 - MS",
    status: "ACTIVE",
    sent: 1986,
    replies: 3,
    replyRate: 0.2,
    bounces: 11,
    bounceRate: 0.6,
    positiveReplies: 0,
    startDate: "2025-01-20",
    lastActivity: "2025-03-02",
  },
  {
    id: "equal-tx-microsoft",
    name: "Equal - TX - Microsoft",
    status: "ACTIVE",
    sent: 6969,
    replies: 25,
    replyRate: 0.4,
    bounces: 140,
    bounceRate: 2.0,
    positiveReplies: 2,
    startDate: "2024-12-01",
    lastActivity: "2025-03-02",
  },
  {
    id: "equal-tx-microsoft-2",
    name: "Equal - TX - Microsoft (2)",
    status: "ACTIVE",
    sent: 1691,
    replies: 4,
    replyRate: 0.2,
    bounces: 37,
    bounceRate: 2.2,
    positiveReplies: 1,
    startDate: "2025-02-01",
    lastActivity: "2025-03-02",
  },
  {
    id: "equal-ma-1000-2000-goog",
    name: "Equal - M&A - 1000-2000 - Goog",
    status: "COMPLETED",
    sent: 357,
    replies: 1,
    replyRate: 0.3,
    bounces: 224,
    bounceRate: 62.7,
    positiveReplies: 0,
    startDate: "2024-10-01",
    lastActivity: "2024-11-15",
  },
  {
    id: "equal-ma-1000-2000-ms-completed",
    name: "Equal - M&A - 1000-2000 - MS",
    status: "COMPLETED",
    sent: 1988,
    replies: 10,
    replyRate: 0.5,
    bounces: 14,
    bounceRate: 0.7,
    positiveReplies: 1,
    startDate: "2024-10-15",
    lastActivity: "2024-12-20",
  },
  {
    id: "equal-new-mexico-ma-google",
    name: "Equal - New Mexico - M&A - Google",
    status: "COMPLETED",
    sent: 1136,
    replies: 15,
    replyRate: 1.3,
    bounces: 16,
    bounceRate: 1.4,
    positiveReplies: 2,
    startDate: "2024-09-15",
    lastActivity: "2024-12-01",
  },
  {
    id: "equal-new-mexico-ma-seg1",
    name: "Equal - New Mexico - M&A - SEG1",
    status: "COMPLETED",
    sent: 3373,
    replies: 50,
    replyRate: 1.5,
    bounces: 137,
    bounceRate: 4.1,
    positiveReplies: 3,
    startDate: "2024-09-01",
    lastActivity: "2024-12-15",
  },
  {
    id: "equal-cap-zips1-ma-ms",
    name: "Equal - Cap Zips1 - M&A - MS",
    status: "PAUSED",
    sent: 1134,
    replies: 7,
    replyRate: 0.6,
    bounces: 56,
    bounceRate: 4.9,
    positiveReplies: 0,
    startDate: "2024-11-01",
    lastActivity: "2025-01-15",
  },
  {
    id: "equal-cap-zips1-ma-seg",
    name: "Equal - Cap Zips1 - M&A - SEG",
    status: "PAUSED",
    sent: 5994,
    replies: 113,
    replyRate: 1.9,
    bounces: 860,
    bounceRate: 14.3,
    positiveReplies: 2,
    startDate: "2024-10-15",
    lastActivity: "2025-01-20",
  },
  {
    id: "equal-cap-zips1-ma-google",
    name: "Equal - Cap Zips1 - M&A - Google",
    status: "PAUSED",
    sent: 2046,
    replies: 12,
    replyRate: 0.6,
    bounces: 391,
    bounceRate: 19.1,
    positiveReplies: 0,
    startDate: "2024-10-20",
    lastActivity: "2025-01-10",
  },
  {
    id: "equal-tigermark-channel-partners-seg",
    name: "Equal - Tigermark - Channel Partners - SEG",
    status: "PAUSED",
    sent: 1888,
    replies: 3,
    replyRate: 0.2,
    bounces: 336,
    bounceRate: 17.8,
    positiveReplies: 0,
    startDate: "2024-12-01",
    lastActivity: "2025-02-01",
  },
  {
    id: "equal-tigermark-issuer-ms",
    name: "Equal - Tigermark - Issuer - MS",
    status: "PAUSED",
    sent: 4046,
    replies: 17,
    replyRate: 0.4,
    bounces: 237,
    bounceRate: 5.9,
    positiveReplies: 1,
    startDate: "2024-11-15",
    lastActivity: "2025-02-01",
  },
  {
    id: "equal-tigermark-issuer-google",
    name: "Equal - Tigermark - Issuer - Google",
    status: "PAUSED",
    sent: 4100,
    replies: 2,
    replyRate: 0.0,
    bounces: 932,
    bounceRate: 22.7,
    positiveReplies: 0,
    startDate: "2024-11-15",
    lastActivity: "2025-02-01",
  },
  {
    id: "equal-tigermark-issuer-seg",
    name: "Equal - Tigermark - Issuer - SEG",
    status: "PAUSED",
    sent: 2321,
    replies: 25,
    replyRate: 1.1,
    bounces: 154,
    bounceRate: 6.6,
    positiveReplies: 0,
    startDate: "2024-11-20",
    lastActivity: "2025-02-01",
  },
  {
    id: "equal-new-mexico-ma-ms",
    name: "Equal - New Mexico - M&A - MS",
    status: "PAUSED",
    sent: 2894,
    replies: 11,
    replyRate: 0.4,
    bounces: 36,
    bounceRate: 1.2,
    positiveReplies: 0,
    startDate: "2024-09-20",
    lastActivity: "2025-01-05",
  },
];

export function getCampaignSummary(): CampaignSummary {
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
  const totalBounces = campaigns.reduce((sum, c) => sum + c.bounces, 0);
  const totalPositiveReplies = campaigns.reduce(
    (sum, c) => sum + c.positiveReplies,
    0
  );

  return {
    totalSent,
    totalReplies,
    averageReplyRate: totalSent > 0 ? (totalReplies / totalSent) * 100 : 0,
    totalBounces,
    overallBounceRate: totalSent > 0 ? (totalBounces / totalSent) * 100 : 0,
    totalPositiveReplies,
    activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    pausedCampaigns: campaigns.filter((c) => c.status === "PAUSED").length,
    completedCampaigns: campaigns.filter((c) => c.status === "COMPLETED")
      .length,
  };
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function getCampaignsByStatus(
  status: "ACTIVE" | "PAUSED" | "COMPLETED"
): Campaign[] {
  return campaigns.filter((c) => c.status === status);
}

export function getBestPerformingCampaign(): Campaign {
  return campaigns.reduce((best, current) =>
    current.replyRate > best.replyRate ? current : best
  );
}

export function getHighBounceCampaigns(): Campaign[] {
  return campaigns
    .filter((c) => c.bounceRate > 8)
    .sort((a, b) => b.bounceRate - a.bounceRate);
}

export const weeklyVolume: WeeklyVolume[] = [
  { week: "Oct 7", sent: 2100, replies: 18, bounces: 95 },
  { week: "Oct 14", sent: 3400, replies: 32, bounces: 180 },
  { week: "Oct 21", sent: 4200, replies: 41, bounces: 250 },
  { week: "Oct 28", sent: 3800, replies: 38, bounces: 220 },
  { week: "Nov 4", sent: 4600, replies: 45, bounces: 310 },
  { week: "Nov 11", sent: 5100, replies: 52, bounces: 340 },
  { week: "Nov 18", sent: 4800, replies: 48, bounces: 290 },
  { week: "Nov 25", sent: 3200, replies: 30, bounces: 200 },
  { week: "Dec 2", sent: 4400, replies: 42, bounces: 270 },
  { week: "Dec 9", sent: 4900, replies: 50, bounces: 320 },
  { week: "Dec 16", sent: 3600, replies: 35, bounces: 210 },
  { week: "Dec 23", sent: 1800, replies: 15, bounces: 110 },
  { week: "Jan 6", sent: 4100, replies: 40, bounces: 260 },
  { week: "Jan 13", sent: 2200, replies: 22, bounces: 140 },
  { week: "Jan 20", sent: 1000, replies: 10, bounces: 60 },
  { week: "Feb 3", sent: 800, replies: 8, bounces: 45 },
  { week: "Feb 10", sent: 600, replies: 6, bounces: 30 },
  { week: "Feb 17", sent: 400, replies: 4, bounces: 20 },
  { week: "Feb 24", sent: 300, replies: 3, bounces: 15 },
  { week: "Mar 3", sent: 200, replies: 2, bounces: 10 },
];
