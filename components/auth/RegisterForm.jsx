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

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", formData);
      console.log(res, "res");
      const { user } = res.data.data;
      console.log(user);
      useAuthStore.getState().setUser(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[1.35rem] font-semibold text-slate-900 tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-[13px] text-slate-400">
          Already have one?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Sign in
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
            htmlFor="name"
            className="text-[12px] font-medium text-slate-600"
          >
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Rushi Katrodiya"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-9 text-[13px] border-slate-200 focus:border-blue-500 bg-white"
          />
        </div>

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
            className="h-9 text-[13px] border-slate-200 focus:border-blue-500 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-[12px] font-medium text-slate-600"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
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
            "Create account"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-2.5 my-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-300 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <button className="w-full h-9 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 flex items-center justify-center gap-2 hover:border-slate-300 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" fill="#4285F4" />
          <rect x="8" y="1" width="5" height="5" rx="1" fill="#EA4335" />
          <rect x="1" y="8" width="5" height="5" rx="1" fill="#34A853" />
          <rect x="8" y="8" width="5" height="5" rx="1" fill="#FBBC05" />
        </svg>
        Continue with Google
      </button>

      <p className="mt-4 text-[11px] text-slate-300 text-center leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-slate-400 hover:text-slate-600">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-slate-400 hover:text-slate-600">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
