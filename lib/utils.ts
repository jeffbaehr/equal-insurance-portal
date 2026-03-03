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

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return {
        bg: "bg-gray-100",
        text: "text-portal-text-primary",
        dot: "bg-portal-accent",
      };
    case "PAUSED":
      return {
        bg: "bg-gray-100",
        text: "text-portal-text-secondary",
        dot: "bg-gray-400",
      };
    case "COMPLETED":
      return {
        bg: "bg-gray-100",
        text: "text-portal-text-secondary",
        dot: "bg-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-portal-text-secondary",
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
