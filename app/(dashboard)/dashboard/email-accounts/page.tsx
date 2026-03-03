"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Shield,
  Flame,
  Inbox,
  Server,
  Activity,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailAccount } from "@/lib/plusvibe";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AccountSummary {
  total: number;
  active: number;
  paused: number;
  warmupActive: number;
  warmupPaused: number;
  avgHealthScore: number;
  totalSentToday: number;
  totalWarmupSentToday: number;
  providers: {
    google: number;
    microsoft: number;
    other: number;
  };
}

interface WarmupStats {
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

interface WarmupTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function WarmupTooltip({ active, payload, label }: WarmupTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-portal-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-sm font-medium text-portal-text-primary mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-portal-text-secondary">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-medium text-portal-text-primary">
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EmailAccountsPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [warmupStats, setWarmupStats] = useState<WarmupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [accountsRes, warmupRes] = await Promise.all([
          fetch("/api/email-accounts"),
          fetch("/api/warmup-stats"),
        ]);

        if (!accountsRes.ok) throw new Error("Failed to fetch email accounts");

        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts);
        setSummary(accountsData.summary);

        if (warmupRes.ok) {
          const warmupData = await warmupRes.json();
          if (warmupData.stats) {
            setWarmupStats(warmupData.stats);
          }
        }
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
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <p className="text-sm text-portal-text-secondary">
            Loading email accounts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-portal-text-primary text-sm mb-2">Failed to load data</p>
          <p className="text-xs text-portal-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  const hasAccounts = accounts.length > 0;
  const hasWarmup = warmupStats !== null;

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-portal-text-primary tracking-tight"
        >
          Email Accounts & Warming
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-portal-text-secondary mt-1"
        >
          {hasAccounts
            ? `${accounts.length} email accounts across your workspace`
            : "Connect your PlusVibe API key to view email accounts"}
        </motion.p>
      </div>

      {summary && hasAccounts && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Total</span>
            </div>
            <p className="text-2xl font-bold text-portal-text-primary">{summary.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Active</span>
            </div>
            <p className="text-2xl font-bold text-portal-text-primary">{summary.active}</p>
          </div>
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Warming</span>
            </div>
            <p className="text-2xl font-bold text-portal-text-primary">{summary.warmupActive}</p>
          </div>
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Avg Health</span>
            </div>
            <p className="text-2xl font-bold text-portal-text-primary">
              {summary.avgHealthScore > 0 ? `${Math.round(summary.avgHealthScore)}%` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Sent Today</span>
            </div>
            <p className="text-2xl font-bold text-portal-text-primary">{summary.totalSentToday}</p>
          </div>
          <div className="bg-white rounded-2xl border border-portal-border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-portal-text-secondary" />
              <span className="text-xs text-portal-text-secondary">Providers</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {summary.providers.google > 0 && (
                <span className="text-xs font-medium text-portal-text-primary">G:{summary.providers.google}</span>
              )}
              {summary.providers.microsoft > 0 && (
                <span className="text-xs font-medium text-portal-text-primary">M:{summary.providers.microsoft}</span>
              )}
              {summary.providers.other > 0 && (
                <span className="text-xs font-medium text-portal-text-primary">O:{summary.providers.other}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {hasWarmup && warmupStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-portal-text-primary">
            Warmup Stats
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
                Inbox Placement
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Inbox</span>
                  <span className="text-lg font-bold text-portal-text-primary">
                    {warmupStats.inboxPercent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-400 transition-all"
                    style={{ width: `${Math.min(parseFloat(warmupStats.inboxPercent), 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-portal-text-secondary">
                  <span>Spam: {warmupStats.spamPercent}%</span>
                  <span>Promo: {warmupStats.promotionPercent}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
                Provider Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Google</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.googlePercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Microsoft</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.microsoftPercent}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Other</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.otherPercent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-portal-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
                Volume
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Total Warmup Sent</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.totalWarmupSent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Landed in Inbox</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.totalInboxSent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Landed in Spam</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.totalSpamSent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-portal-text-secondary">Domains / Inboxes</span>
                  <span className="text-sm font-semibold text-portal-text-primary">
                    {warmupStats.totalDomains} / {warmupStats.totalInboxes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {warmupStats.chartData.length > 0 && (
            <div className="bg-white rounded-2xl border border-portal-border p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-portal-text-primary mb-4">
                Daily Warmup Delivery (Last 30 Days)
              </h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={warmupStats.chartData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient id="warmupInbox" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="warmupSpam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<WarmupTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="inbox"
                      stroke="#6B7280"
                      strokeWidth={2}
                      fill="url(#warmupInbox)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#6B7280", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="spam"
                      stroke="#9CA3AF"
                      strokeWidth={2}
                      fill="url(#warmupSpam)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#9CA3AF", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-portal-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded bg-gray-500" />
                  <span className="text-xs text-portal-text-secondary">Inbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded bg-gray-400" />
                  <span className="text-xs text-portal-text-secondary">Spam</span>
                </div>
              </div>
            </div>
          )}

          {Object.keys(warmupStats.emailDomainDetail).length > 0 && (
            <div className="bg-white rounded-2xl border border-portal-border p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-portal-text-primary mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-portal-text-secondary" />
                Sending Domains
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(warmupStats.emailDomainDetail)
                  .sort(([, a], [, b]) => b - a)
                  .map(([domain, count]) => (
                    <div
                      key={domain}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-xs text-portal-text-primary font-medium truncate mr-2">
                        {domain}
                      </span>
                      <span className="text-xs text-portal-text-secondary font-semibold shrink-0">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {hasAccounts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-portal-text-primary mb-4 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-portal-text-secondary" />
            All Email Accounts
          </h2>

          <div className="bg-white rounded-2xl border border-portal-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-portal-border bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Email Account
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Warmup
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Health (7d)
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Google
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Microsoft
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Daily Limit
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Sent Today
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-portal-text-secondary uppercase tracking-wider">
                      Bounce (3d)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="hover:bg-gray-50/60 transition-colors border-b border-portal-border/50 last:border-b-0"
                    >
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-portal-text-primary">
                            {account.email}
                          </p>
                          <p className="text-xs text-portal-text-secondary">
                            {account.firstName} {account.lastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-portal-text-secondary">
                          {account.provider === "GOOGLE_WORKSPACE" || account.provider === "GOOGLE"
                            ? "Google"
                            : account.provider === "MICROSOFT365" || account.provider === "MICROSOFT"
                              ? "Microsoft"
                              : account.provider || "SMTP"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            account.status === "ACTIVE" ? "bg-portal-accent" : "bg-gray-400"
                          )} />
                          <span className="text-xs font-medium text-portal-text-secondary">{account.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            account.warmupStatus === "ACTIVE" ? "bg-portal-accent" : "bg-gray-400"
                          )} />
                          <span className="text-xs font-medium text-portal-text-secondary">{account.warmupStatus}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-semibold text-portal-text-primary">
                          {account.healthScores.overall7d >= 0 ? `${account.healthScores.overall7d}%` : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-semibold text-portal-text-primary">
                          {account.healthScores.google7d >= 0 ? `${account.healthScores.google7d}%` : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-semibold text-portal-text-primary">
                          {account.healthScores.microsoft7d >= 0 ? `${account.healthScores.microsoft7d}%` : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm tabular-nums text-portal-text-primary">
                        {account.dailyLimit}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm tabular-nums text-portal-text-primary">
                          {account.dailyCounters.emailSentToday}
                        </span>
                        {account.dailyCounters.warmupSentToday > 0 && (
                          <span className="text-xs text-portal-text-secondary ml-1">
                            (+{account.dailyCounters.warmupSentToday} warmup)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-sm font-medium tabular-nums text-portal-text-primary">
                          {account.healthScores.bounceRate3d >= 0
                            ? `${account.healthScores.bounceRate3d}%`
                            : "N/A"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-portal-border bg-gray-50/30">
              <p className="text-xs text-portal-text-secondary">
                {accounts.length} email accounts -- Read-only view from PlusVibe API
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {!hasAccounts && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Mail className="w-7 h-7 text-portal-text-secondary" />
          </div>
          <h2 className="text-lg font-semibold text-portal-text-primary">
            No Email Accounts Found
          </h2>
          <p className="text-sm text-portal-text-secondary text-center max-w-md">
            Email account data will appear here once the PlusVibe API is connected
            and configured with valid credentials. This is a read-only view of your
            email infrastructure.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-portal-border">
            <Mail className="w-4 h-4 text-portal-text-secondary" />
            <span className="text-xs text-portal-text-secondary">
              Verify PLUSVIBE_API_KEY is set in environment variables
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
