import { formatTime } from "./formatTime";

export const formatHoursMinutes = (seconds) => {
  if (seconds == null) return "00:00";
  const timeStr = formatTime(seconds);
  return timeStr.slice(0, -3); // Remove :SS part
};

export const statusVariants = {
  Active: "bg-green-50 text-green-600 border-green-200",
  Idle: "bg-yellow-50 text-yellow-600 border-yellow-200",
  Offline: "bg-gray-50 text-gray-600 border-gray-200",
};

export const getProgressColor = (progress) => {
  if (progress >= 70) return "bg-green-500";
  if (progress >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

export const getAvatarColor = (name) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-red-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};
