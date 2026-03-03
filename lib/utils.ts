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
  if (rate >= 2) return "text-emerald-600";
  if (rate >= 1) return "text-amber-600";
  return "text-red-500";
}

export function getBounceRateColor(rate: number): string {
  if (rate < 3) return "text-emerald-600";
  if (rate <= 8) return "text-amber-600";
  return "text-red-500";
}

export function getReplyRateBg(rate: number): string {
  if (rate >= 2) return "bg-emerald-50";
  if (rate >= 1) return "bg-amber-50";
  return "bg-red-50";
}

export function getBounceRateBg(rate: number): string {
  if (rate < 3) return "bg-emerald-50";
  if (rate <= 8) return "bg-amber-50";
  return "bg-red-50";
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "PAUSED":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
      };
    case "COMPLETED":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
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
