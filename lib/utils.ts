import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function getReplyRateColor(rate: number): string {
  if (rate >= 2) return "text-portal-success";
  if (rate >= 1) return "text-portal-warning";
  return "text-portal-danger";
}

export function getBounceRateColor(rate: number): string {
  if (rate < 3) return "text-portal-success";
  if (rate <= 8) return "text-portal-warning";
  return "text-portal-danger";
}

export function getReplyRateBg(rate: number): string {
  if (rate >= 2) return "bg-portal-success/10";
  if (rate >= 1) return "bg-portal-warning/10";
  return "bg-portal-danger/10";
}

export function getBounceRateBg(rate: number): string {
  if (rate < 3) return "bg-portal-success/10";
  if (rate <= 8) return "bg-portal-warning/10";
  return "bg-portal-danger/10";
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
      };
    case "PAUSED":
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        dot: "bg-amber-400",
      };
    case "COMPLETED":
      return {
        bg: "bg-gray-500/15",
        text: "text-gray-400",
        dot: "bg-gray-400",
      };
    default:
      return {
        bg: "bg-gray-500/15",
        text: "text-gray-400",
        dot: "bg-gray-400",
      };
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
