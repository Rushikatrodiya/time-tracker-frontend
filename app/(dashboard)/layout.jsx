import Sidebar from "@/components/dashboard/Sidebar";
import AuthProvider from "../../components/provider/AuthProvider";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </AuthProvider>
  );
}
