"use client";

import { motion } from "framer-motion";
import { Trophy, AlertTriangle, Brain } from "lucide-react";

interface InsightData {
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
}

interface InsightsPanelProps {
  insights: InsightData;
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-portal-accent" />
        <h2 className="text-lg font-semibold text-portal-text-primary">
          Campaign Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5 hover:border-emerald-500/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-emerald-400">
              Best Performing
            </h3>
          </div>
          <p className="text-sm font-medium text-portal-text-primary mb-2">
            {insights.bestPerforming.name}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-portal-text-secondary">
              <span className="text-emerald-400 font-medium">
                {insights.bestPerforming.replyRate.toFixed(1)}%
              </span>{" "}
              reply rate
            </p>
            <p className="text-xs text-portal-text-secondary">
              {insights.bestPerforming.replies.toLocaleString()} replies from{" "}
              {insights.bestPerforming.sent.toLocaleString()} sent
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5 hover:border-amber-500/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-amber-400">
              Needs Attention
            </h3>
          </div>
          {insights.needsAttention.length > 0 ? (
            <div className="space-y-2">
              {insights.needsAttention.map((campaign, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-xs text-portal-text-primary truncate max-w-[160px]">
                    {campaign.name}
                  </p>
                  <span className="text-xs font-medium text-portal-danger">
                    {campaign.bounceRate.toFixed(1)}% bounce
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-portal-text-secondary">
              All campaigns performing within acceptable parameters.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-portal-surface rounded-2xl border border-white/[0.05] p-5 hover:border-indigo-500/20 transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-portal-accent/10 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-portal-accent" />
            </div>
            <h3 className="text-sm font-semibold text-portal-accent">
              Summary
            </h3>
          </div>
          <p className="text-xs text-portal-text-secondary leading-relaxed">
            {insights.narrative}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
