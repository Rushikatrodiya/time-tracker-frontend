"use client";
import { useCreateEntity } from "@/hooks/useCreateEntity";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import BaseModal from "./BaseModal";

export default function CreateProjectModal() {
  const mutation = useCreateEntity(
    (data) => api.post("/projects", data),
    ["projects"],
  );
  const [open, setOpen] = useState(false);

  // Close modal when mutation succeeds
  useEffect(() => {
    if (mutation.isSuccess) {
      setOpen(false);
    }
  }, [mutation.isSuccess]);

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
      type: "textarea",
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

  const addNewCreate = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-2">
      <BaseModal
        triggerText="New Project"
        triggerIcon={<Plus className="w-3 h-3" />}
        title="Create New Project"
        description="Add a new project to track tasks and time."
        fields={fields}
        onSubmit={addNewCreate}
        onValidate={validateForm}
        submitText={mutation.isPending ? "Creating..." : "Create Project"}
        open={open}
        onOpenChange={setOpen}
      />
      {mutation.error && (
        <div className="text-red-500 text-sm">
          {mutation.error.message || "Failed to create project"}
        </div>
      )}
    </div>
  );
}
