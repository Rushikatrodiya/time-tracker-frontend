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
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../../components/dashboard/Navbar";
import { useCreateEntity } from "../../../../hooks/useCreateEntity";
import useQueryHook from "../../../../hooks/useQuery";
import api from "../../../../lib/api";
import { useAuthStore } from "../../../../store/authStore";

export default function CreateTaskPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  const mutation = useCreateEntity(
    (data) => api.post("/tasks", data),
    ["tasks"],
  );

  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  const { data: usersData, isLoading: usersLoading } = useQueryHook({
    key: ["users"],
    fn: () => api.get("/users"),
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    mutation.mutate(formData);
  };

  if (projectsLoading || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar title="Create Task" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/tasks">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
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
                          <SelectItem key={project.id} value={`${project.id}`}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Right Column - User Assignment */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <Label className="text-[13px] font-medium text-slate-900">
                      Assign to Users
                    </Label>
                  </div>
                  <p className="text-[12px] text-slate-400">
                    Select users to assign this task to
                  </p>
                </div>

                <div className="space-y-3 max-h-75 overflow-y-auto border border-slate-200 rounded-lg p-4">
                  {usersData?.length > 0 ? (
                    usersData.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={user.id}
                          checked={formData.assignedToIds.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleUserToggle(user.id, checked)
                          }
                        />
                        <Label
                          htmlFor={user.id}
                          className="text-[13px] text-slate-700 cursor-pointer"
                        >
                          {user.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-slate-400 text-center py-4">
                      No users available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {mutation.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  {mutation.error.message || "Failed to create task"}
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
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-30"
              >
                {mutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
