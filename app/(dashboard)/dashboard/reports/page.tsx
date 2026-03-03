"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessageSquare,
  UserCheck,
  MailX,
  Inbox,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeeklyReportRow } from "@/lib/plusvibe";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ReportTotals {
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

interface ReportData {
  weeks: WeeklyReportRow[];
  totals: ReportTotals;
  numWeeks: number;
  lastUpdated: string;
}

const WEEK_OPTIONS = [
  { label: "4 weeks", value: 4 },
  { label: "8 weeks", value: 8 },
  { label: "12 weeks", value: 12 },
  { label: "26 weeks", value: 26 },
  { label: "52 weeks", value: 52 },
];

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const RATE_KEYS = new Set(["replyRate", "bounceRate"]);
const LABEL_MAP: Record<string, string> = {
  sent: "Sent",
  replies: "Replies",
  replyRate: "Reply Rate",
  bounceRate: "Bounce Rate",
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-portal-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-portal-text-primary mb-2">
        Week of {label}
      </p>
      {payload.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs text-portal-text-secondary"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span>{LABEL_MAP[p.dataKey] || p.dataKey}:</span>
          <span className="font-medium text-portal-text-primary">
            {RATE_KEYS.has(p.dataKey)
              ? `${p.value.toFixed(1)}%`
              : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numWeeks, setNumWeeks] = useState(12);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/reports?weeks=${numWeeks}`);
        if (!res.ok) throw new Error("Failed to fetch report data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [numWeeks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <p className="text-sm text-portal-text-secondary">
            Loading weekly report...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-portal-text-primary text-sm mb-2">
            Failed to load report data
          </p>
          <p className="text-xs text-portal-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  const hasData = data.weeks.some((w) => w.sent > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-portal-text-primary tracking-tight"
          >
            Weekly Reports
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-portal-text-secondary mt-1"
          >
            Aggregated campaign statistics by week
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-portal-border shadow-sm text-sm font-medium text-portal-text-primary hover:bg-gray-50 transition-colors"
            >
              {WEEK_OPTIONS.find((o) => o.value === numWeeks)?.label}
              <ChevronDown className="w-4 h-4 text-portal-text-secondary" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-portal-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                {WEEK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setNumWeeks(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      numWeeks === opt.value
                        ? "bg-gray-100 font-medium text-portal-text-primary"
                        : "text-portal-text-secondary hover:bg-gray-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-portal-text-secondary/60">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {hasData ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-portal-text-secondary" />
                <span className="text-xs text-portal-text-secondary">
                  Total Sent
                </span>
              </div>
              <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
                {data.totals.sent.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-portal-text-secondary" />
                <span className="text-xs text-portal-text-secondary">
                  Total Replies
                </span>
              </div>
              <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
                {data.totals.replies.toLocaleString()}
              </p>
              <p className="text-sm text-portal-text-secondary mt-1">
                {data.totals.replyRate.toFixed(1)}% reply rate
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-portal-text-secondary" />
                <span className="text-xs text-portal-text-secondary">
                  Positive Replies
                </span>
              </div>
              <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
                {data.totals.positiveReplies.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MailX className="w-4 h-4 text-portal-text-secondary" />
                <span className="text-xs text-portal-text-secondary">
                  Total Bounces
                </span>
              </div>
              <p className="text-3xl font-bold text-portal-text-primary tabular-nums">
                {data.totals.bounces.toLocaleString()}
              </p>
              <p className="text-sm text-portal-text-secondary mt-1">
                {data.totals.bounceRate.toFixed(1)}% bounce rate
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-portal-border p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
              Weekly Send Volume
            </h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.weeks}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="weekLabel"
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                    }
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="sent"
                    fill="#9CA3AF"
                    fillOpacity={0.6}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="replies"
                    fill="#6B7280"
                    fillOpacity={0.8}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-portal-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gray-400/60" />
                <span className="text-xs text-portal-text-secondary">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-gray-500/80" />
                <span className="text-xs text-portal-text-secondary">
                  Replies
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-portal-border p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
              Reply & Bounce Rate Trend
            </h3>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.weeks}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="replyRateGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6B7280" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="bounceRateGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="weekLabel"
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="replyRate"
                    stroke="#6B7280"
                    strokeWidth={2}
                    fill="url(#replyRateGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#6B7280",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bounceRate"
                    stroke="#9CA3AF"
                    strokeWidth={2}
                    fill="url(#bounceRateGrad)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#9CA3AF",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-portal-border">
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 rounded bg-gray-500" />
                <span className="text-xs text-portal-text-secondary">
                  Reply Rate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 rounded bg-gray-400" />
                <span className="text-xs text-portal-text-secondary">
                  Bounce Rate
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="bg-white rounded-2xl border border-portal-border overflow-hidden shadow-sm">
              <div className="px-6 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-portal-text-primary">
                  Week-by-Week Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-b border-portal-border bg-gray-50/50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Week
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Sent
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Replies
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Reply Rate
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Positive
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Bounces
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Bounce Rate
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Leads
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                        Unsubs
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.weeks].reverse().map((week, index) => (
                      <motion.tr
                        key={week.weekStart}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="hover:bg-gray-50/60 transition-colors border-b border-portal-border/50 last:border-b-0"
                      >
                        <td className="px-6 py-3.5">
                          <div>
                            <p className="text-sm font-medium text-portal-text-primary">
                              {week.weekLabel}
                            </p>
                            <p className="text-xs text-portal-text-secondary">
                              {week.weekStart} to {week.weekEnd}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.sent.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.replies.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm font-medium tabular-nums text-portal-text-primary">
                          {week.replyRate.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.positiveReplies.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.bounces.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm font-medium tabular-nums text-portal-text-primary">
                          {week.bounceRate.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.leadsContacted.toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                          {week.unsubscribes.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-portal-border bg-gray-50/50">
                      <td className="px-6 py-3.5 text-sm font-semibold text-portal-text-primary">
                        Total
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.sent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.replies.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.replyRate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.positiveReplies.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.bounces.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.bounceRate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.leadsContacted.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-sm font-semibold tabular-nums text-portal-text-primary">
                        {data.totals.unsubscribes.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-portal-border bg-gray-50/30">
                <p className="text-xs text-portal-text-secondary">
                  {data.numWeeks} weeks -- Read-only data from PlusVibe API
                </p>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-portal-text-secondary" />
          </div>
          <h2 className="text-lg font-semibold text-portal-text-primary">
            No Report Data
          </h2>
          <p className="text-sm text-portal-text-secondary text-center max-w-md">
            Weekly report data will appear here once campaigns have sent emails
            within the selected time range.
          </p>
        </motion.div>
      )}
    </div>
  );
}
