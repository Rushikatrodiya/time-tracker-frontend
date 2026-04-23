"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <div className="w-[220px] bg-white border-r border-slate-200 flex flex-col h-screen flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[14px] font-semibold text-slate-900">
          TimeTracker
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 py-1.5">
          Main
        </p>
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User info */}
      <div className="px-3 py-3 flex items-center gap-2.5">
        <Avatar className="w-7 h-7">
          <AvatarFallback className="bg-blue-600 text-white text-[11px] font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-slate-900 truncate">
            {user?.name}
          </p>
          <p className="text-[10px] text-slate-400">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
