"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Campaign } from "@/lib/seed-data";

interface ReplyRateChartProps {
  campaigns: Campaign[];
}

function getBarColor(rate: number): string {
  if (rate >= 2) return "#10B981";
  if (rate >= 1) return "#F59E0B";
  return "#6366F1";
}

function truncateName(name: string, maxLen: number = 25): string {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen) + "...";
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      replyRate: number;
      replies: number;
      sent: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-portal-surface border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-portal-text-primary mb-1">
        {data.name}
      </p>
      <p className="text-xs text-portal-text-secondary">
        Reply rate: {data.replyRate.toFixed(1)}%
      </p>
      <p className="text-xs text-portal-text-secondary">
        {data.replies.toLocaleString()} replies / {data.sent.toLocaleString()}{" "}
        sent
      </p>
    </div>
  );
}

export function ReplyRateChart({ campaigns }: ReplyRateChartProps) {
  const sortedData = [...campaigns]
    .sort((a, b) => b.replyRate - a.replyRate)
    .map((c) => ({
      name: c.name,
      shortName: truncateName(c.name, 22),
      replyRate: c.replyRate,
      replies: c.replies,
      sent: c.sent,
    }));

  return (
    <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-6">
      <h3 className="text-lg font-semibold text-portal-text-primary mb-1">
        Reply Rate by Campaign
      </h3>
      <p className="text-sm text-portal-text-secondary mb-6">
        Sorted by reply rate, highest first
      </p>

      <div style={{ height: sortedData.length * 32 + 40, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              tickFormatter={(v: number) => `${v}%`}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              width={180}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
            />
            <Bar dataKey="replyRate" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.replyRate)}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
