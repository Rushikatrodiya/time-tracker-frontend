"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function EditProjectModal({ project, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => api.put(`/projects/${project.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
    },
  });

  // Pre-fill form when project changes or modal opens
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        projectKey: project.projectKey || "",
        description: project.description || "",
      });
    }
  }, [project, open]);

  const fields = [
    {
      id: "name",
      label: "Project Name",
      placeholder: "Enter project name",
      required: true,
    },
    {
      id: "projectKey",
      label: "Project Key",
      placeholder: "e.g., PROJ",
      required: true,
      helperText:
        "Project Key must be 2–4 uppercase characters. This key will be used as the task ID prefix (e.g., ATRE-101, APP-25).",
    },
    {
      id: "description",
      label: "Description",
      placeholder: "Enter project description (optional)",
      required: false,
    },
  ];

  const validateProjectKey = (projectKey) => {
    if (!projectKey) return "Project Key is required";
    if (projectKey.length < 2 || projectKey.length > 4) {
      return "Project Key must be 2–4 characters long";
    }
    if (!/^[A-Z]+$/.test(projectKey)) {
      return "Project Key must contain only uppercase letters";
    }
    return "";
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name || data.name.trim() === "") {
      errors.name = "Project Name is required";
    }
    const projectKeyError = validateProjectKey(data.projectKey);
    if (projectKeyError) {
      errors.projectKey = projectKeyError;
    }
    return errors;
  };

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <Label>{field.label}</Label>
              {field.id === "description" ? (
                <Textarea
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  placeholder={field.placeholder}
                  className="text-[13px]"
                  required={field.required}
                  value={formData[field.id] || ""}
                  rows={3}
                />
              ) : (
                <Input
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  placeholder={field.placeholder}
                  className="text-[13px]"
                  required={field.required}
                  value={formData[field.id] || ""}
                />
              )}
              {field.helperText && (
                <p className="text-xs text-gray-500">{field.helperText}</p>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const validationErrors = validateForm(formData);
              if (Object.keys(validationErrors).length > 0) {
                // Handle validation errors
                return;
              }
              handleSubmit(formData);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
