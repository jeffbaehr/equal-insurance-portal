"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-portal-accent" />
        </div>
        <h1 className="text-xl font-bold text-portal-text-primary">
          Reports
        </h1>
        <p className="text-sm text-portal-text-secondary text-center max-w-md">
          Detailed campaign reports and exportable analytics are coming soon.
          Check the Dashboard for current performance metrics.
        </p>
      </motion.div>
    </div>
  );
}
