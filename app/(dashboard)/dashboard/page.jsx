"use client";
import { Clock, FolderOpen } from "lucide-react";
import Navbar from "../../../components/dashboard/Navbar";
import StatCard from "../../../components/dashboard/StateCard";
import useQueryHook from "../../../hooks/useQuery";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { formatTime } from "../../../utils/formatTime";
import { getInitials } from "../../../utils/avatarHelpers";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  const { data: dashboard, isLoading } = useQueryHook({
    key: ["dashboard"],
    fn: () => api.get("/team/dashboard"),
    select: (res) => res.data.data,
  });

  if (isLoading) return <div>Loading...</div>;

  const isTeam = userRole === "ADMIN" || userRole === "MANAGER";

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Welcome back, {user?.name} 👋
          </h2>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Here's what's happening today.
          </p>
        </div>

        {/* Stats */}
        <div className={`grid gap-3 mb-6 grid-cols-4`}>
          {isTeam ? (
            <>
              <StatCard
                label="Total Projects"
                value={dashboard?.stats.totalProjects || 0}
                sub="active projects"
              />
              <StatCard
                label="Hours Today"
                value={formatTime(dashboard?.stats.hoursToday || 0)}
                sub={dashboard?.stats.runningTimers > 0 ? `${dashboard?.stats.runningTimers} timers still running` : "combined across team"}
              />
              <StatCard
                label="Hours This Month"
                value={formatTime(dashboard?.stats.hoursThisMonth || 0)}
                sub="combined across team"
              />
              <StatCard
                label="Team Members"
                value={dashboard?.teamActivity?.length || 0}
                sub={`${dashboard?.teamActivity?.filter(u => u.isActive).length || 0} active now`}
              />
            </>
          ) : (
            <>
              <StatCard
                label="My Tasks"
                value={dashboard?.stats.myTasks || 0}
                sub={`${dashboard?.stats.completedTasks || 0} completed`}
              />
              <StatCard
                label="Hours Today"
                value={formatTime(dashboard?.stats.hoursToday || 0)}
                sub="my logged hours"
              />
              <StatCard
                label="Hours This Month"
                value={formatTime(dashboard?.stats.hoursThisMonth || 0)}
                sub="my logged hours"
              />
              <StatCard
                label="My Projects"
                value={dashboard?.myTasks?.length || 0}
                sub="assigned projects"
              />
            </>
          )}
        </div>

        {/* Body */}
        {isTeam ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Team Activity */}
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-[13px] font-semibold text-slate-900">Team Activity</h3>
              </div>
              <div className="p-4 space-y-3">
                {dashboard?.teamActivity?.length > 0 ? (
                  dashboard.teamActivity.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-slate-900">{member.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {member.currentTask ?? "No active task"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[12px] text-slate-700">{formatTime(member.hoursToday)}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${member.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          {member.isActive ? "Active" : "Offline"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-slate-400 text-center py-4">No team members yet</p>
                )}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-[13px] font-semibold text-slate-900">Active Projects</h3>
              </div>
              <div className="p-4 space-y-3">
                {dashboard?.activeProjects?.length > 0 ? (
                  dashboard.activeProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-[12px] font-medium text-slate-900">{project.name}</p>
                          <p className="text-[11px] text-slate-400">{project.taskCount} tasks · {project.memberCount} members</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-slate-400 text-center py-4">No active projects</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // USER view
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-[13px] font-semibold text-slate-900">My Tasks</h3>
            </div>
            <div className="p-4">
              {dashboard?.myTasks?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.myTasks.map((group) => (
                    <div key={group.projectId}>
                      {/* Project header */}
                      <div className="flex items-center gap-2 mb-2">
                        <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[12px] font-semibold text-slate-600">{group.projectName}</p>
                      </div>
                      {/* Tasks */}
                      <div className="space-y-2 pl-5">
                        {group.tasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                            <div>
                              <p className="text-[12px] font-medium text-slate-900">
                                <span className="text-slate-400 mr-1">{group.projectKey}-{task.ticketNumber}</span>
                                {task.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${task.status === "DONE" ? "bg-green-100 text-green-700" :
                                task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                  "bg-slate-100 text-slate-500"
                                }`}>
                                {task.status}
                              </span>
                              <span className="text-[11px] text-slate-400">{formatTime(task.hoursLogged)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-[13px] font-medium text-slate-900">No tasks assigned yet</p>
                  <p className="text-[12px] text-slate-400 mt-1">Your manager will assign tasks to you soon</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}