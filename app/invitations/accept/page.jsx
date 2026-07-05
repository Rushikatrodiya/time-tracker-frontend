"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      setTokenError("Invalid invitation link. Token is missing.");
      setIsValidating(false);
      return;
    }

    setToken(tokenParam);
    validateToken(tokenParam);
  }, []);

  const validateToken = async (tokenParam) => {
    try {
      await api.get(`/invitations/validate/${tokenParam}`);
      setIsValidating(false);
    } catch (err) {
      setTokenError(
        err.response?.data?.message || "Invalid or expired invitation link."
      );
      setIsValidating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const res = await api.post("/invitations/accept", {
        token,
        name: formData.name.trim(),
        password: formData.password,
      });

      console.log("Accept invitation response:", res.data);
      console.log("Full response:", res);

      const user = res.data.data || res.data;
      
      if (!user || !user.email) {
        console.error("Invalid user data:", user);
        throw new Error("No user data returned from API");
      }

      console.log("Setting user in store:", user);
      useAuthStore.getState().setUser(user);
      setUserEmail(user.email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to accept invitation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-slate-400">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-slate-900 mb-2">
                Invalid Invitation
              </h1>
              <p className="text-[13px] text-slate-400">{tokenError}</p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-slate-900 mb-2">
                Invitation Accepted!
              </h1>
              <p className="text-[13px] text-slate-400 mb-3">
                Your account has been created successfully.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-left">
                <p className="text-[12px] text-slate-600 mb-1">
                  <span className="font-medium">Email:</span> {userEmail}
                </p>
                <p className="text-[12px] text-slate-600">
                  <span className="font-medium">Password:</span> The password you just set
                </p>
              </div>
              <p className="text-[13px] text-slate-400 mt-3">
                Please log in with these credentials to access your account.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-[18px] font-semibold text-slate-900 tracking-tight mb-1">
            Accept Invitation
          </h1>
          <p className="text-[13px] text-slate-400">
            Set up your account to join the team
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
              placeholder="John Doe"
              value={formData.name}
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
              "Accept Invitation"
            )}
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-slate-300 text-center leading-relaxed">
          By accepting this invitation, you agree to our{" "}
          <a href="/terms" className="text-slate-400 hover:text-slate-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-slate-400 hover:text-slate-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
