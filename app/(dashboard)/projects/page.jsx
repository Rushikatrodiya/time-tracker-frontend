"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderKanban, MoreHorizontal, Plus, Users } from "lucide-react";
import Link from "next/link";
import CreateProjectModal from "../../../components/dashboard/CreateProjectModal";
import Navbar from "../../../components/dashboard/Navbar";
import StatCard from "../../../components/dashboard/StateCard";
import useQueryHook from "../../../hooks/useQuery";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import {
  getProjectHealth,
  getStatusVariant,
} from "../../../utils/projectHelpers";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  if (projectsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar title="Projects" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">
              Projects Overview
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Manage and track all your projects
            </p>
          </div>
          <CreateProjectModal />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Total Projects"
            value={projectsData?.length || 0}
            sub={`${projectsData?.length || 0} projects`}
          />
          <StatCard
            label="Team Members"
            value={
              projectsData?.reduce(
                (total, project) => total + (project.memberCount || 0),
                0,
              ) || 0
            }
            sub="Across all projects"
          />
          <StatCard
            label="Active Projects"
            value={
              projectsData?.filter((p) => p.status === "ACTIVE")?.length || 0
            }
            sub="Currently running"
          />
        </div>

        {/* Projects List */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-slate-500" />
              <h3 className="text-[13px] font-semibold text-slate-900">
                All Projects
              </h3>
            </div>
          </div>

          {projectsData?.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-[13px] font-semibold text-slate-900">
                          {project.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${getStatusVariant(project.status)}`}
                        >
                          {project.status || "Active"}
                        </Badge>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full ${getProjectHealth(project).bgColor}`}
                        >
                          {(() => {
                            const HealthIcon = getProjectHealth(project).icon;
                            return (
                              <HealthIcon
                                className={`w-3 h-3 ${getProjectHealth(project).color}`}
                              />
                            );
                          })()}
                          <span
                            className={`text-[10px] font-medium ${getProjectHealth(project).color}`}
                          >
                            {getProjectHealth(project).label}
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-500 mb-3 line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Users className="w-3 h-3" />
                        {project.memberCount || 0} members
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              href={`/projects/${project.id}/team`}
                              className="flex items-center gap-2"
                            >
                              <Users className="w-4 h-4" />
                              Manage Team
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FolderKanban className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-[13px] font-medium text-slate-900 mb-1">
                No projects yet
              </p>
              <p className="text-[12px] text-slate-400 mb-4">
                Create your first project to get started
              </p>
              <Button size="sm" className="text-[12px] h-8">
                <Plus className="w-3 h-3 mr-1" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
