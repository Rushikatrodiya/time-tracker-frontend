import { FolderKanban } from "lucide-react";

export default function TasksPlaceholderPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-100 max-w-md">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Select a Project
        </h2>
        <p className="text-slate-500 mb-6">
          Please expand the Tasks menu in the sidebar and choose a project to view its tasks.
        </p>
      </div>
    </div>
  );
}
