"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { WeeklyVolume } from "@/lib/seed-data";

interface VolumeChartProps {
  data: WeeklyVolume[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-portal-surface border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl">
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
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-medium text-portal-text-primary">
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <div className="bg-portal-surface rounded-2xl border border-white/[0.05] p-6">
      <h3 className="text-lg font-semibold text-portal-text-primary mb-1">
        Send Volume Over Time
      </h3>
      <p className="text-sm text-portal-text-secondary mb-6">
        Weekly email volume with reply tracking
      </p>

      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="repliesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sent"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#sentGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#6366F1",
                stroke: "#0F1117",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="replies"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#repliesGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#10B981",
                stroke: "#0F1117",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded bg-portal-accent" />
          <span className="text-xs text-portal-text-secondary">
            Emails Sent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded bg-portal-success" />
          <span className="text-xs text-portal-text-secondary">Replies</span>
        </div>
      </div>
    </div>
  );
}
