"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Mail,
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-portal-sidebar border-r border-white/[0.06] flex flex-col z-50">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-portal-accent/10 border border-portal-accent/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-portal-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-portal-text-primary">
              Praxis Rock
            </h2>
            <p className="text-xs text-portal-text-secondary">Advisors</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-portal-text-secondary" />
          <div>
            <p className="text-xs font-medium text-portal-text-primary">
              Equal Insurance
            </p>
            <p className="text-[10px] text-portal-text-secondary">
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
                  ? "bg-portal-accent/10 text-portal-accent border border-portal-accent/10"
                  : "text-portal-text-secondary hover:text-portal-text-primary hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px]",
                  isActive
                    ? "text-portal-accent"
                    : "text-portal-text-secondary"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-portal-text-secondary hover:text-portal-danger hover:bg-portal-danger/5 transition-all duration-200 w-full border border-transparent"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
