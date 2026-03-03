"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KpiCard } from "@/components/kpi-card";
import { CampaignTable } from "@/components/campaign-table";
import { ReplyRateChart } from "@/components/charts/reply-rate-chart";
import { VolumeChart } from "@/components/charts/volume-chart";
import { InsightsPanel } from "@/components/insights-panel";
import { Send, MessageSquare, UserCheck, Zap } from "lucide-react";
import type { Campaign, CampaignSummary, WeeklyVolume } from "@/lib/seed-data";
import { formatPercent } from "@/lib/utils";

interface DashboardData {
  campaigns: Campaign[];
  summary: CampaignSummary;
  weeklyVolume: WeeklyVolume[];
  insights: {
    bestPerforming: {
      name: string;
      replyRate: number;
      replies: number;
      sent: number;
    };
    needsAttention: Array<{
      name: string;
      bounceRate: number;
      bounces: number;
      status: string;
    }>;
    narrative: string;
  };
  source: string;
  lastUpdated: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-portal-accent/30 border-t-portal-accent rounded-full animate-spin" />
          <p className="text-sm text-portal-text-secondary">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">
            Failed to load dashboard data
          </p>
          <p className="text-xs text-portal-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-portal-text-primary tracking-tight"
          >
            Campaign Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-portal-text-secondary mt-1"
          >
            M&A outreach performance for Equal Insurance
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-portal-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-portal-text-secondary">
              {data.source === "api" ? "Live data" : "Seed data"}
            </span>
          </div>
          <span className="text-xs text-portal-text-secondary/60">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Emails Sent"
          value={data.summary.totalSent}
          icon={Send}
          delay={0}
          iconBg="bg-blue-50"
          iconColor="text-portal-accent"
        />
        <KpiCard
          label="Total Replies"
          value={data.summary.totalReplies}
          subtitle={`${formatPercent(data.summary.averageReplyRate)} reply rate`}
          icon={MessageSquare}
          delay={0.1}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          label="Positive Responses"
          value={data.summary.totalPositiveReplies}
          subtitle="Meetings booked / interested"
          icon={UserCheck}
          delay={0.2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <KpiCard
          label="Active Campaigns"
          value={data.summary.activeCampaigns}
          subtitle={`${data.summary.pausedCampaigns} paused, ${data.summary.completedCampaigns} completed`}
          icon={Zap}
          delay={0.3}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CampaignTable campaigns={data.campaigns} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <ReplyRateChart campaigns={data.campaigns} />
        <VolumeChart data={data.weeklyVolume} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <InsightsPanel insights={data.insights} />
      </motion.div>
    </div>
  );
}
