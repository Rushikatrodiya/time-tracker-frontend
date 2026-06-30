"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/utils/avatarHelpers";
import { useCreateEntity } from "@/hooks/useCreateEntity";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("general");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { 
    mutate: updateProfile, 
    isPending: isSaving, 
    error: profileErrorObj, 
    isSuccess: isProfileSuccess, 
    data: profileData,
    reset: resetProfile
  } = useCreateEntity(
    async (payload) => {
      const response = await api.patch(`/users/${user.id}/profile`, payload);
      return response.data;
    },
    [["users", "me"], ["users", "list"], ["team", "overview"], ["project-members"]]
  );

  const { 
    mutate: updatePassword, 
    isPending: isUpdatingPassword, 
    error: passwordErrorObj, 
    isSuccess: isPasswordSuccess, 
    data: passwordData,
    reset: resetPassword
  } = useCreateEntity(
    async (payload) => {
      const response = await api.patch(`/users/${user.id}/password`, payload);
      return response.data;
    },
    ["user", user?.id]
  );

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!user) return;

    resetProfile();

    const formData = new FormData(e.target);
    const payload = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
    };

    updateProfile(payload, {
      onSuccess: (data) => {
        if (data?.success) {
          setUser({ ...user, ...data.data });
        }
      }
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!user) return;

    resetPassword();

    const formData = new FormData(e.target);
    const payload = {
      current_password: formData.get("currentPassword"),
      new_password: formData.get("newPassword"),
    };

    updatePassword(payload, {
      onSuccess: (data) => {
        if (data?.success) {
          e.target.reset();
        }
      }
    });
  };

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];



  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 -mt-20 relative z-10 pb-16">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 backdrop-blur-xl bg-white/90">
          <div className="relative group cursor-pointer">
            <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-4xl font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {user?.name}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                {user?.role}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {user?.email}
              </span>
            </p>
          </div>
        </div>



        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200/60 p-2 shadow-sm sticky top-6">
              <nav className="flex flex-row lg:flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-blue-600" : "text-slate-400")} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8">
              {activeTab === "general" && (
                <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage your personal details and how others see you.</p>
                  </div>

                  {profileErrorObj && (
                    <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                      {profileErrorObj.response?.data?.errors?.length > 0 ? (
                        <div className="space-y-1">
                          {profileErrorObj.response.data.errors.map((err, i) => (
                            <div key={i}>{err.message}</div>
                          ))}
                        </div>
                      ) : (
                        profileErrorObj.response?.data?.message || "Failed to update profile"
                      )}
                    </div>
                  )}
                  {isProfileSuccess && profileData?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-600">
                      {profileData.message || "Profile updated successfully"}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        defaultValue={user?.name?.split(' ')[0] || ""}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        defaultValue={user?.name?.split(' ')[1] || ""}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        defaultValue={user?.email || ""}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-slate-100 pt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={cn(
                        "px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg transition-all shadow-sm",
                        isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                      )}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleUpdatePassword} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
                    <p className="text-sm text-slate-500 mt-1">Keep your account secure by updating your password.</p>
                  </div>

                  {passwordErrorObj && (
                    <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                      {passwordErrorObj.response?.data?.errors?.length > 0 ? (
                        <div className="space-y-1">
                          {passwordErrorObj.response.data.errors.map((err, i) => (
                            <div key={i}>{err.message}</div>
                          ))}
                        </div>
                      ) : (
                        passwordErrorObj.response?.data?.message || "Failed to update password"
                      )}
                    </div>
                  )}
                  {isPasswordSuccess && passwordData?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-600">
                      {passwordData.message || "Password updated successfully"}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">Current Password</label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">New Password</label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="New password"
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-slate-100 pt-6">
                    <button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className={cn(
                        "px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg transition-all shadow-sm",
                        isUpdatingPassword ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800"
                      )}
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
