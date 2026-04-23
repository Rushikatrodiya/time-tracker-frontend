export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "done":
      return "bg-green-50 text-green-600 border-green-200";
    case "in_progress":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "todo":
      return "bg-slate-50 text-slate-600 border-slate-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export const getPriorityVariant = (priority) => {
  switch (priority) {
    case 1:
      return "bg-red-50 text-red-600 border-red-200";
    case 2:
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case 3:
      return "bg-green-50 text-green-600 border-green-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export const taskPriorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      return "Unknown";
  }
};
