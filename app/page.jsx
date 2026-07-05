"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white text-[#0f0f1a] overflow-x-hidden">
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[68px] bg-white/85 backdrop-blur-xl border-b border-black/[0.07] transition-shadow ${scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.06)]" : ""
          }`}
      >
        <a href="#" className="flex items-center gap-2.5 text-[17px] font-bold">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#3B5BDB] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-white fill-none stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
          </div>
          TimeTracker
        </a>
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="#features" className="text-sm text-[#4a4a6a] font-medium hover:text-[#0f0f1a] transition-colors">Features</a></li>
          <li><a href="#how" className="text-sm text-[#4a4a6a] font-medium hover:text-[#0f0f1a] transition-colors">How it works</a></li>
          <li><a href="#roles" className="text-sm text-[#4a4a6a] font-medium hover:text-[#0f0f1a] transition-colors">Roles</a></li>
        </ul>
        <a
          href="/register"
          className="bg-[#3B5BDB] text-white text-sm font-semibold px-[22px] py-[9px] rounded-[9px] hover:bg-[#2f4abf] hover:-translate-y-px transition-all"
        >
          Get started free
        </a>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f9] pt-[120px] pb-20 px-[5%] text-center relative overflow-hidden">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(59,91,219,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 inline-flex items-center gap-1.5 bg-white border border-black/[0.07] rounded-full px-4 py-1.5 text-xs font-semibold text-[#4a4a6a] mb-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
          <span className="text-[#3B5BDB]">✦</span> Next-gen task &amp; time tracking software
        </div>

        <h1 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-[42px] md:text-[64px] lg:text-[72px] font-extrabold leading-[1.1] tracking-tight max-w-[800px]">
          Track less, <span className="text-[#3B5BDB]">achieve more.</span>
          <br />Fully unified for teams.
        </h1>

        <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-lg text-[#4a4a6a] leading-relaxed max-w-[520px] mt-6 mb-10">
          TimeTracker bridges the gap between task management and accurate project visibility. No complex set-ups — just crystal clear time reports for startups and small teams.
        </p>

        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-300 flex gap-3 flex-wrap justify-center">
          <a
            href="/register"
            className="bg-[#3B5BDB] text-white text-[15px] font-semibold px-7 py-[13px] rounded-[10px] inline-flex items-center gap-2 hover:bg-[#2f4abf] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,91,219,0.3)] transition-all"
          >
            Get started free →
          </a>
          <a
            href="#showcase"
            className="bg-white text-[#0f0f1a] text-[15px] font-semibold px-7 py-[13px] rounded-[10px] border-[1.5px] border-black/[0.07] inline-flex items-center gap-2 hover:border-gray-400 hover:-translate-y-0.5 transition-all"
          >
            See how it works
          </a>
        </div>

        {/* HERO MOCKUP — REPLACE WITH YOUR DASHBOARD/TASKS SCREENSHOT */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-[400ms] mt-16 w-full max-w-[960px] rounded-2xl overflow-hidden border border-black/[0.09] shadow-[0_30px_80px_rgba(0,0,0,0.12)] bg-white">
          <Image src="/tasks.png" alt="TimeTracker tasks dashboard" width={960} height={540} className="w-full h-auto" unoptimized />


        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#f4f5f9] py-24 px-[5%]">
        <div className="text-center">
          <span className="fade-up opacity-0 translate-y-8 transition-all duration-700 block text-[11px] font-bold tracking-[1.2px] text-[#3B5BDB] uppercase mb-3">
            Product capabilities
          </span>
          <h2 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-[28px] md:text-[44px] font-extrabold tracking-tight leading-tight mb-3.5">
            Everything you need to<br />track tasks and time.
          </h2>
          <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-[17px] text-[#4a4a6a] leading-relaxed max-w-[560px] mx-auto">
            No bloating features. Just highly polished, precise, and user-friendly tools tailored to startups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto mt-14">
          {[
            {
              title: "Live time tracking",
              desc: "Simple one-click stopwatch interface. Toggle timer on any task instantly to accumulate precise, automatic work sessions.",
              icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></>,
            },
            {
              title: "Team dashboard",
              desc: "High-level overview of total projects, active members, and currently tracked durations. Keep progress perfectly in sight.",
              icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
            },
            {
              title: "Project management",
              desc: "Group tasks inside structured project boundaries. Map members and track health status transparently across all work.",
              icon: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
            },
            {
              title: "Role-based access",
              desc: "Assign roles of Admin, Manager, and User to restrict actions. Fine-tune permissions across the workspace.",
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
            },
            {
              title: "Task priorities",
              desc: "Categorize workloads with High, Medium, or Low priority levels. Keep critical features at the top of your pipeline.",
              icon: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
            },
            {
              title: "Team invitations by email",
              desc: "Add workspace contributors instantly by sending email invites. Simple role assignment on setup — no friction.",
              icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 delay-[${i * 100}ms] bg-white border border-black/[0.07] rounded-[14px] p-8 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all`}
            >
              <div className="w-[46px] h-[46px] rounded-xl bg-[#eef1ff] flex items-center justify-center mb-5">
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#3B5BDB] fill-none stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[#4a4a6a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE — REPLACE EACH PANEL WITH YOUR REAL SCREENSHOT */}
      <section id="showcase" className="py-24 px-[5%]">
        <div className="text-center">
          <span className="fade-up opacity-0 translate-y-8 transition-all duration-700 block text-[11px] font-bold tracking-[1.2px] text-[#3B5BDB] uppercase mb-3">
            Live product showcase
          </span>
          <h2 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-[28px] md:text-[44px] font-extrabold tracking-tight leading-tight mb-3.5">
            Explore the real<br />application interface.
          </h2>
          <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-[17px] text-[#4a4a6a] leading-relaxed max-w-[560px] mx-auto">
            Click the tabs below to view actual product screenshots.
          </p>
        </div>

        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 flex gap-1 mx-auto mt-12 mb-10 bg-[#f4f5f9] rounded-xl p-1.5 max-w-[480px] border border-black/[0.07]">
          {["dashboard", "projects", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-[9px] text-[13px] font-semibold transition-all ${activeTab === tab ? "bg-white text-[#3B5BDB] shadow-[0_1px_6px_rgba(0,0,0,0.08)]" : "text-[#4a4a6a]"
                }`}
            >
              {tab === "dashboard" ? "Dashboard view" : tab === "projects" ? "Projects view" : "Users & team"}
            </button>
          ))}
        </div>

        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 rounded-[14px] overflow-hidden border border-black/[0.09] shadow-[0_20px_60px_rgba(0,0,0,0.1)]">

          {activeTab === "dashboard" && (
            <Image src="/dashboard.png" alt="TimeTracker tasks dashboard" width={960} height={540} className="w-full h-auto" unoptimized />
          )}

          {activeTab === "projects" && (
            <Image src="/projects.png" alt="TimeTracker tasks dashboard" width={960} height={540} className="w-full h-auto" unoptimized />
          )}
          {activeTab === "users" && (
            <Image src="/users.png" alt="TimeTracker tasks dashboard" width={960} height={540} className="w-full h-auto" unoptimized />
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#f4f5f9] py-24 px-[5%]">
        <div className="text-center">
          <span className="fade-up opacity-0 translate-y-8 transition-all duration-700 block text-[11px] font-bold tracking-[1.2px] text-[#3B5BDB] uppercase mb-3">
            Onboarding workflow
          </span>
          <h2 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-[28px] md:text-[44px] font-extrabold tracking-tight leading-tight mb-3.5">
            Get up and running<br />in minutes.
          </h2>
          <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-[17px] text-[#4a4a6a] leading-relaxed max-w-[560px] mx-auto">
            TimeTracker is built for speed. No manuals required — just a simple four-step natural workflow.
          </p>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-y-10 max-w-[1000px] mx-auto mt-14">
          <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#3B5BDB] to-[#6741d9] z-0" />

          {[
            { n: 1, title: "Create project", desc: "Add a new project inside your workspace and assign team members to it right away." },
            { n: 2, title: "Add tasks", desc: "Log development or design cards with custom priority markers and assign responsible team members." },
            { n: 3, title: "Track time", desc: "Use the simplified stopwatch buttons to toggle time tracking directly against assigned tasks." },
            { n: 4, title: "Review dashboard", desc: "Access beautiful time summaries detailing exact records, team active times, and overall project statuses." },
          ].map((s, i) => (
            <div key={i} className={`fade-up opacity-0 translate-y-8 transition-all duration-700 delay-[${i * 100}ms] relative z-10 text-center px-4`}>
              <div className="w-11 h-11 rounded-full bg-[#3B5BDB] text-white text-[15px] font-bold flex items-center justify-center mx-auto mb-5 border-[3px] border-white shadow-[0_0_0_2px_#3B5BDB]">
                {s.n}
              </div>
              <h3 className="text-[15px] font-bold mb-2">{s.title}</h3>
              <p className="text-[13px] text-[#4a4a6a] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24 px-[5%]">
        <div className="text-center">
          <span className="fade-up opacity-0 translate-y-8 transition-all duration-700 block text-[11px] font-bold tracking-[1.2px] text-[#3B5BDB] uppercase mb-3">
            Structured workspace
          </span>
          <h2 className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-100 text-[28px] md:text-[44px] font-extrabold tracking-tight leading-tight mb-3.5">
            Role-based workspace<br />permissions.
          </h2>
          <p className="fade-up opacity-0 translate-y-8 transition-all duration-700 delay-200 text-[17px] text-[#4a4a6a] leading-relaxed max-w-[560px] mx-auto">
            Fine-tune access boundaries. Match exactly what your organization requires to streamline workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1000px] mx-auto mt-14">
          {[
            {
              name: "Workspace Admin",
              desc: "Full authority over the workspace. Manage all users and roles, create or remove projects, send invitations, and view all team activity.",
              iconBg: "#eef1ff",
              iconColor: "#3B5BDB",
              checkBg: "#eef1ff",
              checkColor: "#3B5BDB",
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              perms: ["Manage all users & roles", "Create & delete projects", "Send invitations & view all activity"],
            },
            {
              name: "Project Manager",
              desc: "Active control over developmental tasks, overseeing contributor stopwatch durations, creating new project bounds, and allocating member tickets.",
              iconBg: "#e6f9f0",
              iconColor: "#1a7a4a",
              checkBg: "#e6f9f0",
              checkColor: "#1a7a4a",
              icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
              perms: ["Edit tasks & priorities", "Inspect team timecards", "Allocate task assignees"],
            },
            {
              name: "Team Member",
              desc: "Direct focus on assigned work boards. Toggle stopwatch timers on allocated tickets, log task progress, and review individual dashboard metrics.",
              iconBg: "#fff3e0",
              iconColor: "#b35900",
              checkBg: "#fff3e0",
              checkColor: "#b35900",
              icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" /></>,
              perms: ["Toggle stopwatch tracking", "Update task progress", "Access personal productivity data"],
            },
          ].map((role, i) => (
            <div
              key={i}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 delay-[${i * 100}ms] bg-white border border-black/[0.07] rounded-[14px] p-8 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition-all`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: role.iconBg }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[1.8]" style={{ stroke: role.iconColor }} strokeLinecap="round" strokeLinejoin="round">
                    {role.icon}
                  </svg>
                </div>
                <div className="text-[17px] font-bold">{role.name}</div>
              </div>
              <p className="text-sm text-[#4a4a6a] leading-relaxed mb-5">{role.desc}</p>
              <div className="text-[10px] font-bold tracking-wide text-[#8888aa] uppercase mb-2.5">Core permissions</div>
              <ul className="flex flex-col gap-2 list-none">
                {role.perms.map((p, j) => (
                  <li key={j} className="text-[13px] text-[#4a4a6a] flex items-center gap-2.5">
                    <span
                      className="w-[17px] h-[17px] rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: role.checkBg }}
                    >
                      <svg viewBox="0 0 12 12" className="w-[9px] h-[9px] fill-none stroke-[2.5]" style={{ stroke: role.checkColor }} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mx-[5%] mb-24 rounded-[20px] bg-gradient-to-br from-[#3B5BDB] to-[#6741d9] py-20 px-[5%] text-center">
        <h2 className="text-[28px] md:text-[46px] font-extrabold text-white tracking-tight mb-3">
          Ready to reclaim your team's focus?
        </h2>
        <p className="text-[17px] text-white/75 mb-10">
          Get started for free today. Invite your team, add your tasks, and start logging time seamlessly.
        </p>
        <a
          href="/register"
          className="bg-white text-[#3B5BDB] text-[15px] font-bold px-[34px] py-3.5 rounded-[10px] inline-block hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all"
        >
          Get started free →
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0f0f1a] text-white/40 py-10 px-[5%] flex items-center justify-between flex-wrap gap-4">
        <a href="#" className="flex items-center gap-2.5 text-white text-[15px] font-bold">
          <div className="w-7 h-7 rounded-[7px] bg-[#3B5BDB] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white fill-none stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
          </div>
          TimeTracker
        </a>
        <div className="flex gap-20 flex-wrap">
          <a href="#features" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">Features</a>
          <a href="#how" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">How it works</a>
          <a href="#roles" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">Roles</a>

        </div>
        <p className="text-[13px]">© 2026 TimeTracker Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}