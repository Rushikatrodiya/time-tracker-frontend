import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Users,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "MANAGER", "USER"],
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    roles: ["ADMIN", "MANAGER", "USER"],
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
];
