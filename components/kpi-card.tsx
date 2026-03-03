"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  formattedValue?: string;
  subtitle?: string;
  icon: LucideIcon;
  delay?: number;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  startAnimation: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startAnimation]);

  return count;
}

export function KpiCard({
  label,
  value,
  formattedValue,
  subtitle,
  icon: Icon,
  delay = 0,
  iconBg = "bg-blue-50",
  iconColor = "text-portal-accent",
  trend,
}: KpiCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const animatedValue = useAnimatedCounter(value, 2000, isInView);

  const displayValue = formattedValue
    ? formattedValue
    : animatedValue.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-white border border-portal-border",
        "hover:shadow-lg hover:shadow-black/[0.04] hover:border-portal-accent/20 transition-all duration-300",
        "group cursor-default"
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
              <Icon className={cn("w-[18px] h-[18px]", iconColor)} />
            </div>
            <span className="text-sm font-medium text-portal-text-secondary">
              {label}
            </span>
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full",
                trend.positive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}
            </span>
          )}
        </div>

        <div className="text-4xl font-bold tracking-tight text-portal-text-primary tabular-nums">
          {displayValue}
        </div>

        {subtitle && (
          <p className="text-sm text-portal-text-secondary mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
