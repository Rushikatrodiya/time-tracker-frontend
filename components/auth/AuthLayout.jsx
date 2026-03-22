"use client";
import { Clock } from "lucide-react";
import Link from "next/link";

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
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">
              Enterprise Ready
            </span>
          </div>

          <div className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">
            Project & Time Management
          </div>

          <h2 className="text-[2.2rem] font-semibold text-white leading-tight tracking-tight">
            One platform.
            <br />
            <span className="text-blue-400">Every deadline.</span>
          </h2>

          <p className="text-[13px] text-white/40 leading-relaxed max-w-[280px] font-light">
            Manage projects, assign tasks, and track time — all in one place.
            Built for teams that ship.
          </p>
        </div>

        {/* Features */}
        <div className="relative space-y-2.5">
          {[
            "Role-based access — Admin, Manager, User",
            "Real-time timer with automatic duration",
            "Project & task management in one place",
            "Secure authentication with refresh tokens",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <div className="w-[18px] h-[18px] rounded-full bg-blue-500/20 border border-blue-400/20 flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4L3 5.5L6.5 2"
                    stroke="#60a5fa"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[12px] text-white/40 font-light">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="relative text-[11px] text-white/20 font-light">
          © 2026 TimeTracker. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">TimeTracker</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <Link
              href="/login"
              className={`pb-2 mr-6 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                activeTab === "login"
                  ? "border-blue-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={`pb-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                activeTab === "register"
                  ? "border-blue-600 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Create account
            </Link>
          </div>

          {/* Form */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
