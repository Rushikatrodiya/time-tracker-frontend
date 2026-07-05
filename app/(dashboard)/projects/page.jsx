"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderKanban, MoreHorizontal, Plus, Users, Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateProjectModal from "../../../components/dashboard/CreateProjectModal";
import EditProjectModal from "../../../components/dashboard/EditProjectModal";
import Navbar from "../../../components/dashboard/Navbar";
import StatCard from "../../../components/dashboard/StateCard";
import useQueryHook from "../../../hooks/useQuery";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import {
  getProjectHealth,
  getStatusVariant,
} from "../../../utils/projectHelpers";
import { useCreateEntity } from "../../../hooks/useCreateEntity";

import { useUpdateProject } from "../../../hooks/useProjects";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  const deleteMutation = useCreateEntity(
    (projectId) => api.delete(`/projects/${projectId}`),
    [["projects"], ["tasks"]],
  );

  const updateMutation = useUpdateProject();

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleArchiveToggle = (project) => {
    const newStatus = project.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";
    updateMutation.mutate({ projectId: project.id, status: newStatus });
  };

  const handleDeleteProject = (project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = () => {
    if (!deletingProject) return;
    deleteMutation.mutate(deletingProject.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingProject(null);
      },
    });
  };

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
          {userRole === "ADMIN" && <CreateProjectModal />}
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
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <div className="flex items-center gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit Project
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveToggle(project)}>
                            <div className="flex items-center gap-2">
                              {project.status === "ARCHIVED" ? (
                                <>
                                  <ArchiveRestore className="w-4 h-4" />
                                  Unarchive Project
                                </>
                              ) : (
                                <>
                                  <Archive className="w-4 h-4" />
                                  Archive Project
                                </>
                              )}
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={`/projects/${project.id}/team`}
                              className="flex items-center gap-2"
                            >
                              <Users className="w-4 h-4" />
                              Manage Team
                            </Link>
                          </DropdownMenuItem>
                          {userRole === "ADMIN" && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteProject(project)}
                              className="text-red-600"
                            >
                              <div className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Project
                              </div>
                            </DropdownMenuItem>
                          )}
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
              {userRole === "ADMIN" && (
                <Button size="sm" className="text-[12px] h-8">
                  <Plus className="w-3 h-3 mr-1" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>

        <EditProjectModal
          project={editingProject}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
            Once deleted, this project and everything in it will be gone forever. You won't be able to get it back.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Deleting this project will also remove:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>All tasks inside this project</li>
                <li>All time logs recorded for those tasks</li>
                <li>All project settings</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteProject}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
