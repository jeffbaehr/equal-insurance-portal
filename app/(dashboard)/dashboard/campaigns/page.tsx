"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CampaignTable } from "@/components/campaign-table";
import type { Campaign } from "@/lib/seed-data";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setCampaigns(json.campaigns);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-portal-accent/30 border-t-portal-accent rounded-full animate-spin" />
      </div>
    );
  }

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
  const totalBounces = campaigns.reduce((sum, c) => sum + c.bounces, 0);

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-portal-text-primary tracking-tight"
        >
          All Campaigns
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-portal-text-secondary mt-1"
        >
          {campaigns.length} campaigns across all statuses
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-8 px-6 py-4 bg-white rounded-2xl border border-portal-border shadow-sm"
      >
        <div>
          <p className="text-xs text-portal-text-secondary">Total Sent</p>
          <p className="text-xl font-bold text-portal-text-primary tabular-nums">
            {totalSent.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-portal-border" />
        <div>
          <p className="text-xs text-portal-text-secondary">Total Replies</p>
          <p className="text-xl font-bold text-portal-text-primary tabular-nums">
            {totalReplies.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-portal-border" />
        <div>
          <p className="text-xs text-portal-text-secondary">Avg Reply Rate</p>
          <p className="text-xl font-bold text-emerald-600 tabular-nums">
            {totalSent > 0
              ? ((totalReplies / totalSent) * 100).toFixed(1)
              : "0.0"}
            %
          </p>
        </div>
        <div className="w-px h-8 bg-portal-border" />
        <div>
          <p className="text-xs text-portal-text-secondary">Total Bounces</p>
          <p className="text-xl font-bold text-portal-text-primary tabular-nums">
            {totalBounces.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-portal-border" />
        <div>
          <p className="text-xs text-portal-text-secondary">Bounce Rate</p>
          <p className="text-xl font-bold text-amber-600 tabular-nums">
            {totalSent > 0
              ? ((totalBounces / totalSent) * 100).toFixed(1)
              : "0.0"}
            %
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CampaignTable campaigns={campaigns} />
      </motion.div>
    </div>
  );
}
