"use client";
import { useCreateEntity } from "@/hooks/useCreateEntity";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
      id: "description",
      label: "Description",
      placeholder: "Enter project description (optional)",
      required: false,
    },
  ];

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
