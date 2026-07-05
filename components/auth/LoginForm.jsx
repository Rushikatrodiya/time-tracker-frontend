"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      console.log("Login response:", res.data);
      console.log("Cookies:", document.cookie);

      const { user } = res.data;
      useAuthStore.getState().setUser(user);
      router.push("/dashboard");
    } catch (err) {
      console.log("Error:", err.response?.data);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
          Sign in to your account
        </h1>
        <p className="text-[13px] text-slate-400">
          New to TimeTracker?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Create a free account
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-md text-[12px] text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[12px] font-medium text-slate-600"
          >
            Work email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-9 text-[13px] border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[12px] font-medium text-slate-600"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-slate-400 hover:text-blue-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-9 text-[13px] border-slate-200 focus:border-blue-500 pr-9 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
