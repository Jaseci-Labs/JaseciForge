"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  LayoutDashboard,
  Settings,
  BarChart3,
  Calendar,
  Users,
  FileText,
  Bell,
} from "lucide-react";
import { cn } from "@/_core/utils";

interface TaskSidebarProps {
  stats: {
    total: number;
    active: number;
    priorities: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

export function TaskSidebar({ stats }: TaskSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Main",
      items: [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tasks", label: "Tasks", icon: FileText },
        { href: "/calendar", label: "Calendar", icon: Calendar },
        { href: "/team", label: "Team", icon: Users },
      ],
    },
    {
      title: "Analytics",
      items: [
        { href: "/analytics", label: "Overview", icon: BarChart3 },
        { href: "/notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "Settings",
      items: [
        { href: "/profile", label: "Profile", icon: User },
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {navItems.map((section) => (
        <div key={section.title}>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </h3>
          <nav className="mt-2 space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="pt-4 border-t">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-2 px-3">
          <div className="p-3 bg-card rounded-lg border text-center hover:bg-muted/50 transition-colors">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="p-3 bg-card rounded-lg border text-center hover:bg-muted/50 transition-colors">
            <div className="text-2xl font-bold text-primary">
              {stats.active}
            </div>
            <div className="text-xs text-muted-foreground">Active Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
