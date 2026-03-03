"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Mail,
  Flame,
  BarChart3,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Mail,
  },
  {
    label: "Email Accounts",
    href: "/dashboard/email-accounts",
    icon: Flame,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-portal-sidebar flex flex-col z-50">
      <div className="p-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-portal-accent flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Equal Parts
            </h2>
            <p className="text-xs text-white/50">Insurance Portal</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-white/[0.05] border border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-white/40" />
          <div>
            <p className="text-xs font-medium text-white/90">
              Equal Insurance
            </p>
            <p className="text-[10px] text-white/40">
              Michael Witte
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-portal-accent text-white"
                  : "text-white/60 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px]",
                  isActive ? "text-white" : "text-white/50"
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-portal-lime" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
