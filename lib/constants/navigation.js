import {
  CheckSquare,
  Clock,
  FolderKanban,
  LayoutDashboard,
  UserCheck,
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
    label: "Time Logs",
    href: "/timelogs",
    icon: Clock,
    roles: ["ADMIN", "MANAGER", "USER"],
  },
  {
    label: "My Team",
    href: "/my-team",
    icon: UserCheck,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    roles: ["ADMIN"],
  },
];
