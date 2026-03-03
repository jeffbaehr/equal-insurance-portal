"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatNumber, formatPercent, getStatusColor } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/lib/seed-data";

type SortField =
  | "name"
  | "status"
  | "sent"
  | "replies"
  | "replyRate"
  | "bounces"
  | "bounceRate";
type SortDir = "asc" | "desc";
type FilterTab = "ALL" | "ACTIVE" | "COMPLETED" | "PAUSED";

interface CampaignTableProps {
  campaigns: Campaign[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [sortField, setSortField] = useState<SortField>("sent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    if (activeTab !== "ALL") {
      result = result.filter((c) => c.status === activeTab);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }, [campaigns, sortField, sortDir, activeTab]);

  const tabs: { label: string; value: FilterTab; count: number }[] = [
    { label: "All", value: "ALL", count: campaigns.length },
    {
      label: "Active",
      value: "ACTIVE",
      count: campaigns.filter((c) => c.status === "ACTIVE").length,
    },
    {
      label: "Completed",
      value: "COMPLETED",
      count: campaigns.filter((c) => c.status === "COMPLETED").length,
    },
    {
      label: "Paused",
      value: "PAUSED",
      count: campaigns.filter((c) => c.status === "PAUSED").length,
    },
  ];

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-portal-accent" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-portal-accent" />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-portal-border overflow-hidden shadow-sm">
      <div className="flex items-center gap-1 px-6 pt-5 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.value
                ? "bg-gray-900 text-white"
                : "text-portal-text-secondary hover:text-portal-text-primary hover:bg-gray-100"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-1.5 text-xs",
                activeTab === tab.value
                  ? "text-white/60"
                  : "text-portal-text-secondary/50"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-portal-border bg-gray-50/50">
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors"
                >
                  Campaign
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("sent")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors ml-auto"
                >
                  Sent
                  <SortIcon field="sent" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("replies")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors ml-auto"
                >
                  Replies
                  <SortIcon field="replies" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("replyRate")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors ml-auto"
                >
                  Reply Rate
                  <SortIcon field="replyRate" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <button
                  onClick={() => handleSort("bounces")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors ml-auto"
                >
                  Bounces
                  <SortIcon field="bounces" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort("bounceRate")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider hover:text-portal-text-primary transition-colors ml-auto"
                >
                  Bounce Rate
                  <SortIcon field="bounceRate" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredCampaigns.map((campaign, index) => {
                const statusColors = getStatusColor(campaign.status);

                return (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="group hover:bg-gray-50/60 transition-colors border-b border-portal-border/50 last:border-b-0"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="text-sm font-medium text-portal-text-primary hover:text-portal-accent transition-colors"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusColors.bg,
                          statusColors.text
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            statusColors.dot
                          )}
                        />
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                      {formatNumber(campaign.sent)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                      {formatNumber(campaign.replies)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-sm font-medium tabular-nums text-portal-text-primary">
                        {formatPercent(campaign.replyRate)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                      {formatNumber(campaign.bounces)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-medium tabular-nums text-portal-text-primary">
                        {formatPercent(campaign.bounceRate)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-portal-border flex items-center justify-between bg-gray-50/30">
        <p className="text-xs text-portal-text-secondary">
          Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        </p>
        <p className="text-xs text-portal-text-secondary/50">
          Click column headers to sort
        </p>
      </div>
    </div>
  );
}
