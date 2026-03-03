"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  cn,
  formatNumber,
  formatPercent,
  getReplyRateColor,
  getBounceRateColor,
  getStatusColor,
} from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/lib/seed-data";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const found = json.campaigns.find(
          (c: Campaign) => c.id === params.id
        );
        setCampaign(found || null);
      } catch (err) {
        console.error("Failed to load campaign:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-portal-accent/30 border-t-portal-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-portal-text-secondary">Campaign not found</p>
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-portal-accent hover:underline"
        >
          Back to campaigns
        </Link>
      </div>
    );
  }

  const statusColors = getStatusColor(campaign.status);
  const openRate =
    campaign.sent > 0
      ? ((campaign.sent - campaign.bounces) / campaign.sent) * 100
      : 0;
  const deliveredCount = campaign.sent - campaign.bounces;
  const noReplyCount = deliveredCount - campaign.replies;

  const breakdownData = [
    {
      label: "Delivered",
      value: deliveredCount,
      percentage:
        campaign.sent > 0 ? (deliveredCount / campaign.sent) * 100 : 0,
      color: "bg-portal-accent",
    },
    {
      label: "Replied",
      value: campaign.replies,
      percentage:
        campaign.sent > 0 ? (campaign.replies / campaign.sent) * 100 : 0,
      color: "bg-portal-success",
    },
    {
      label: "Bounced",
      value: campaign.bounces,
      percentage: campaign.bounceRate,
      color: "bg-portal-danger",
    },
    {
      label: "No Reply",
      value: noReplyCount,
      percentage:
        campaign.sent > 0 ? (noReplyCount / campaign.sent) * 100 : 0,
      color: "bg-portal-text-secondary/30",
    },
  ];

  const timelineEvents = [
    {
      label: "Campaign Created",
      date: campaign.startDate,
      icon: Calendar,
      active: true,
    },
    {
      label: "First Emails Sent",
      date: campaign.startDate,
      icon: Send,
      active: true,
    },
    {
      label:
        campaign.status === "COMPLETED"
          ? "Campaign Completed"
          : campaign.status === "PAUSED"
            ? "Campaign Paused"
            : "Currently Active",
      date: campaign.lastActivity,
      icon: Clock,
      active: campaign.status === "ACTIVE",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-portal-text-secondary hover:text-portal-text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-portal-text-primary tracking-tight"
          >
            {campaign.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mt-2"
          >
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                statusColors.bg,
                statusColors.text
              )}
            >
              <span
                className={cn("w-1.5 h-1.5 rounded-full", statusColors.dot)}
              />
              {campaign.status}
            </span>
            <span className="text-sm text-portal-text-secondary">
              Started{" "}
              {new Date(campaign.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-portal-accent" />
            <span className="text-xs text-portal-text-secondary">
              Total Sent
            </span>
          </div>
          <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
            {formatNumber(campaign.sent)}
          </p>
        </div>

        <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-portal-success" />
            <span className="text-xs text-portal-text-secondary">Replies</span>
          </div>
          <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
            {formatNumber(campaign.replies)}
          </p>
          <p
            className={cn(
              "text-sm font-medium mt-1",
              getReplyRateColor(campaign.replyRate)
            )}
          >
            {formatPercent(campaign.replyRate)} reply rate
          </p>
        </div>

        <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-portal-warning" />
            <span className="text-xs text-portal-text-secondary">Bounces</span>
          </div>
          <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
            {formatNumber(campaign.bounces)}
          </p>
          <p
            className={cn(
              "text-sm font-medium mt-1",
              getBounceRateColor(campaign.bounceRate)
            )}
          >
            {formatPercent(campaign.bounceRate)} bounce rate
          </p>
        </div>

        <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-portal-text-secondary">
              Positive Replies
            </span>
          </div>
          <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
            {campaign.positiveReplies}
          </p>
          <p className="text-sm text-portal-text-secondary mt-1">
            meetings / interested
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-portal-surface rounded-2xl border border-white/[0.05] p-6"
        >
          <h3 className="text-lg font-semibold text-portal-text-primary mb-6">
            Contact Breakdown
          </h3>

          <div className="flex h-3 rounded-full overflow-hidden mb-6 bg-white/[0.03]">
            {breakdownData.map((item) => (
              <div
                key={item.label}
                className={cn("h-full transition-all", item.color)}
                style={{ width: `${Math.max(item.percentage, 0.5)}%` }}
              />
            ))}
          </div>

          <div className="space-y-4">
            {breakdownData.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("w-3 h-3 rounded-sm", item.color)} />
                  <span className="text-sm text-portal-text-secondary">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-portal-text-primary tabular-nums">
                    {formatNumber(item.value)}
                  </span>
                  <span className="text-xs text-portal-text-secondary tabular-nums w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-portal-surface rounded-2xl border border-white/[0.05] p-6"
        >
          <h3 className="text-lg font-semibold text-portal-text-primary mb-6">
            Campaign Timeline
          </h3>

          <div className="space-y-0">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      event.active
                        ? "bg-portal-accent/10 border border-portal-accent/30"
                        : "bg-white/[0.03] border border-white/[0.06]"
                    )}
                  >
                    <event.icon
                      className={cn(
                        "w-3.5 h-3.5",
                        event.active
                          ? "text-portal-accent"
                          : "text-portal-text-secondary"
                      )}
                    />
                  </div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-px h-8 bg-white/[0.06] my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      event.active
                        ? "text-portal-text-primary"
                        : "text-portal-text-secondary"
                    )}
                  >
                    {event.label}
                  </p>
                  <p className="text-xs text-portal-text-secondary/70 mt-0.5">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-portal-text-secondary">
                Delivery Rate
              </span>
              <span className="text-sm font-medium text-portal-text-primary">
                {openRate.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
              <div
                className="h-full rounded-full bg-portal-accent transition-all"
                style={{ width: `${Math.min(openRate, 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
