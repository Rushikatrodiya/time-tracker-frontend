"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

const roleBadgeVariants = {
  ADMIN: "bg-blue-50 text-blue-600 border-blue-200",
  MANAGER: "bg-purple-50 text-purple-600 border-purple-200",
  USER: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function Navbar({ title }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/signout");
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <>
      <div className="bg-white px-6 py-3 flex items-center justify-between">
        <h1 className="text-[15px] font-semibold text-slate-900">{title}</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={roleBadgeVariants[user?.role]}>
            {user?.role}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-[12px] h-7"
          >
            Sign out
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
}
