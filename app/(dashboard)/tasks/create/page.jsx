"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../../../../components/dashboard/Navbar";
import { useCreateEntity } from "../../../../hooks/useCreateEntity";
import useQueryHook from "../../../../hooks/useQuery";
import { useFilteredProjectMembers } from "../../../../hooks/useTeamData";
import api from "../../../../lib/api";
import { useAuthStore } from "../../../../store/authStore";

export default function CreateTaskPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  const mutation = useCreateEntity(
    (data) => api.post("/tasks", data),
    [["tasks"], ["team", "overview"]],
  );

  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 2,
    projectId: "",
    assignedToIds: [],
  });
  const [formError, setFormError] = useState("");

  const { data: projectMembersData, isLoading: projectMembersLoading } = useFilteredProjectMembers(formData.projectId);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedProject = projectsData?.find((p) => p.id == formData.projectId);
  const isArchived = selectedProject?.status === "ARCHIVED";

  const handleUserToggle = (assignedToIds, checked) => {
    setFormData((prev) => ({
      ...prev,
      assignedToIds: checked
        ? [...prev.assignedToIds, assignedToIds]
        : prev.assignedToIds.filter((id) => id !== assignedToIds),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Make user assignment required
    if (formData.assignedToIds.length === 0 && userRole !== "USER") {
      setFormError("Please assign the task to at least one user.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      assignedToIds:
        formData.assignedToIds.length > 0 ? formData.assignedToIds : [user.id],
    };
    mutation.mutate(dataToSubmit, {
      onSuccess: () => router.push(`/tasks/${formData.projectId}`),
    });
  };

  if (projectsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar title="Create Task" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Tasks
            </Button>
          </Link>
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">
              Create New Task
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Fill in the details to create a new task
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Left Column - Basic Info */}
            {/* Left Column - Basic Info */}
            {(() => {
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter task title"
                        className="text-[13px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Enter task description"
                        className="text-[13px] min-h-30"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority *</Label>
                        <Select
                          value={formData.priority.toString()}
                          onValueChange={(value) =>
                            handleInputChange("priority", parseInt(value))
                          }
                        >
                          <SelectTrigger className="text-[13px]">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Low</SelectItem>
                            <SelectItem value="2">Medium</SelectItem>
                            <SelectItem value="3">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {userRole !== "USER" && (
                        <div className="space-y-2">
                          <Label htmlFor="project">Project</Label>
                          <Select
                            value={formData.projectId.toString()}
                            onValueChange={(value) =>
                              handleInputChange("projectId", parseInt(value))
                            }
                          >
                            <SelectTrigger className="text-[13px]">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectsData?.map((project) => (
                                <SelectItem
                                  key={project.id}
                                  value={`${project.id}`}
                                >
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - User Assignment - Only show if a project is selected */}
                  {formData.projectId && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <Label className="text-[13px] font-medium text-slate-900">
                            Assign to Users *
                          </Label>
                        </div>
                        <p className="text-[12px] text-slate-400">
                          Select users to assign this task to
                        </p>
                      </div>

                      <div className="space-y-3 max-h-75 overflow-y-auto border border-slate-200 rounded-lg p-4">
                        {projectMembersLoading ? (
                          <p className="text-[13px] text-slate-500">Loading users...</p>
                        ) : (() => {
                          if (projectMembersData.length > 0) {
                            return projectMembersData.map((member) => {
                              const u = member.user;
                              return (
                                <div
                                  key={u.id}
                                  className="flex items-center space-x-3"
                                >
                                  <Checkbox
                                    id={u.id}
                                    checked={formData.assignedToIds.includes(u.id)}
                                    disabled={formData.assignedToIds.length > 0 && !formData.assignedToIds.includes(u.id)}
                                    onCheckedChange={(checked) =>
                                      handleUserToggle(u.id, checked)
                                    }
                                  />
                                  <Label
                                    htmlFor={u.id}
                                    className={`text-[13px] ${formData.assignedToIds.length > 0 && !formData.assignedToIds.includes(u.id)
                                      ? "text-slate-400 cursor-not-allowed"
                                      : "text-slate-700 cursor-pointer"
                                      }`}
                                  >
                                    {u.name}
                                  </Label>
                                </div>
                              );
                            });
                          }
                          return (
                            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <Users className="w-5 h-5 text-slate-400" />
                              </div>
                              <h4 className="text-[13px] font-medium text-slate-700">No other team members</h4>
                              <p className="text-[12px] text-slate-400 mt-1 mb-4 leading-normal">
                                There are no other members in this project. Please add team members first.
                              </p>
                              <div className="flex flex-col gap-2 w-full">
                                <Link href={`/projects/${formData.projectId}/team`}>
                                  <Button type="button" variant="outline" size="sm" className="w-full text-[12px] h-8">
                                    <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                                    Manage Project Team
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Error Display */}
            {(formError || mutation.error) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  {formError || mutation.error?.message || "Failed to create task"}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Link href="/dashboard/tasks">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <div
                title={isArchived ? "Cannot create tasks in an archived project" : ""}
                className={isArchived ? "cursor-not-allowed" : ""}
              >
                <Button
                  type="submit"
                  disabled={mutation.isPending || isArchived}
                  className={`min-w-30 ${isArchived ? "pointer-events-none" : ""}`}
                >
                  {mutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
