"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center">
          <Settings className="w-7 h-7 text-portal-accent" />
        </div>
        <h1 className="text-xl font-bold text-portal-text-primary">
          Settings
        </h1>
        <p className="text-sm text-portal-text-secondary text-center max-w-md">
          Portal settings and account management will be available in a future
          update. Contact your Praxis Rock advisor for any configuration changes.
        </p>
      </motion.div>
    </div>
  );
}
