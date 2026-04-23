"use client";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock } from "lucide-react";
import Navbar from "../../../components/dashboard/Navbar";
import StatCard from "../../../components/dashboard/StateCard";
import useQueryHook from "../../../hooks/useQuery";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role; // Assuming role is stored in user object
  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  const { data: userData, isLoading: userLoading } = useQueryHook({
    key: ["users"],
    fn: () => api.get("/users"),
    select: (res) => res.data.data,
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
  });

  const { data: tasksData, isLoading: tasksLoading } = useQueryHook({
    key: ["tasks"],
    fn: () => api.get("/tasks"),
    select: (res) => res.data.data.tasks,
  });

  // console.log(userData, "userData==");

  // Calculate recent tasks (latest 5)
  let recentTasks = [];
  let completedTasks = 0;
  if (tasksData) {
    recentTasks = tasksData?.slice(-5).reverse() || [];
    completedTasks =
      tasksData?.filter((task) => task.status === "DONE").length || 0;
  }

  if (projectsLoading || tasksLoading || userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Welcome back 👋
          </h2>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Here's what's happening today.
          </p>
        </div>

        <div className="grid gap-3 mb-6">
          {userRole === "MANAGER" || userRole === "ADMIN" ? (
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                label="Projects"
                value={projectsData?.length || 0}
                sub={`${projectsData?.length || 0} projects`}
              />
              <StatCard
                label="Tasks"
                value={tasksData?.length || 0}
                sub={`${completedTasks} completed`}
              />
              <StatCard label="Hours logged" value="156" sub="This week" />
              <StatCard
                label="Team members"
                value={userData?.length || 0}
                sub={`${userData?.length || 0} members`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Tasks" value="0" sub="No tasks yet" />
              <StatCard label="Hours logged" value="0" sub="This week" />
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        {userRole === "MANAGER" || userRole === "ADMIN" ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Recent Tasks */}
            <div className="bg-white border border-slate-200 rounded-lg">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-500" />
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    Recent Tasks
                  </h3>
                </div>
              </div>
              <div className="p-4">
                {recentTasks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-slate-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {task.projectId
                              ? `Project: ${task.project.name}`
                              : "No project"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            task.status === "DONE"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : task.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400 text-center py-4">
                    No recent tasks
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[13px] font-medium text-slate-900">
              Start tracking your time
            </p>
            <p className="text-[12px] text-slate-400 mt-1">
              Once you have tasks assigned, you'll see them here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
