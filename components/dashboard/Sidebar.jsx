"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials } from "@/utils/avatarHelpers";
import { useAuthStore } from "../../store/authStore";
import { useProjectList } from "@/hooks/useProjectList";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const { projects } = useProjectList(isTasksOpen);

  const filteredNav = navItems.filter((item) => {
    // Check role
    if (!item.roles.includes(user?.role)) {
      return false;
    }

    return true;
  });

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

          if (item.label === "Tasks") {
            return (
              <div key={item.href} className="space-y-1">
                <button
                  onClick={() => setIsTasksOpen(!isTasksOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                    pathname === "/tasks"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {isTasksOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isTasksOpen && (
                  <div className="pl-6 space-y-1 mt-1">
                    {projects?.map((project) => {
                      const isActiveProject = pathname === `/tasks/${project.id}`;
                      return (
                        <Link
                          key={project.id}
                          href={`/tasks/${project.id}`}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                            isActiveProject
                              ? "text-blue-600 font-medium bg-blue-50"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isActiveProject ? "bg-blue-600" : "bg-slate-300"
                          )} />
                          {project.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

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
      <Link
        href="/profile"
        className="px-3 py-3 flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer group"
      >
        <Avatar className="w-7 h-7 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
          <AvatarFallback className="bg-blue-600 text-white text-[11px] font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {user?.name}
          </p>
          <p className="text-[10px] text-slate-400">{user?.role}</p>
        </div>
      </Link>
    </div>
  );
}
