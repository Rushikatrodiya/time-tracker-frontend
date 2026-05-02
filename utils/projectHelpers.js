import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const getProjectHealth = (project) => {
  const memberCount = project.memberCount || 0;
  if (memberCount === 0) return { status: "warning", icon: AlertCircle, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "No Team" };
  if (memberCount >= 3) return { status: "healthy", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", label: "Healthy" };
  return { status: "attention", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50", label: "Small Team" };
};

export const getStatusVariant = (status) => {
  const map = {
    active: "bg-green-50 text-green-600 border-green-200",
    completed: "bg-blue-50 text-blue-600 border-blue-200",
    "on-hold": "bg-yellow-50 text-yellow-600 border-yellow-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return map[status?.toLowerCase()] ?? "bg-slate-50 text-slate-600 border-slate-200";
};
