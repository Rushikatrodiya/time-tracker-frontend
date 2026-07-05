"use client";
import { Clock, LayoutDashboard, TimerReset, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: LayoutDashboard,
    title: "Projects & tasks",
    desc: "Create projects, assign tasks with priority and due dates.",
  },
  {
    icon: TimerReset,
    title: "Time logs per task",
    desc: "Start and stop timers on tasks. Duration tracked automatically.",
  },
  {
    icon: Users,
    title: "Team activity dashboard",
    desc: "See who's active and hours logged today.",
  },
];

const roles = [
  { name: "Admin", desc: "Full control over users & org" },
  { name: "Manager", desc: "Manages projects & tasks" },
  { name: "User", desc: "Logs time on assigned tasks" },
];

const AuthLayout = ({ children, activeTab }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between bg-[#1e3a5f] p-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)",
          }}
        />
        <div className="absolute bottom-[-80px] right-[-80px] w-[280px] h-[280px] rounded-full border border-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">
            TimeTracker
          </span>
        </div>

        {/* Brand */}
        <div className="relative space-y-4">
          <div className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">
            Project & Time Management
          </div>

          <h2 className="text-[2.2rem] font-semibold text-white leading-tight tracking-tight">
            Track work.<br />
            <span className="text-blue-400">Ship on time.</span>
          </h2>

          <p className="text-[13px] text-white/40 leading-relaxed max-w-[280px] font-light">
            Manage projects, assign tasks, and log time — all in one place.
          </p>

          {/* Features */}
          <div className="space-y-2 pt-2">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3.5 py-3"
              >
                <div className="w-[30px] h-[30px] rounded-md bg-blue-500/10 border border-blue-400/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <div className="text-[12.5px] font-medium text-white/80 leading-tight">
                    {title}
                  </div>
                  <div className="text-[11.5px] text-white/30 font-light leading-snug mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Roles */}
          <div className="flex gap-2 pt-1">
            {roles.map(({ name, desc }) => (
              <div
                key={name}
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-2.5 text-center"
              >
                <div className="text-[11px] font-semibold text-blue-400 tracking-wide">
                  {name}
                </div>
                <div className="text-[10px] text-white/25 font-light leading-snug mt-0.5">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[11px] text-white/20 font-light">
          © 2026 TimeTracker. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">TimeTracker</span>
          </div>

          <div className="flex border-b border-slate-200 mb-6">
            <Link
              href="/login"
              className={`pb-2 mr-6 text-[13px] font-medium border-b-2 -mb-px transition-colors ${activeTab === "login"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={`pb-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${activeTab === "register"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              Create account
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;