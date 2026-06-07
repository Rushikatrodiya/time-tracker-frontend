"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import Navbar from "../../../components/dashboard/Navbar";
import { useInvitationForm } from "../../../hooks/useInvitationForm";

export default function UsersPage() {
  const { form, errors, handleChange, handleSubmit, reset } = useInvitationForm({
    onSubmit: (data) => {
      console.log("Send invite", data);
    },
  });

  return (
    <>
      <Navbar title="Users" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Invitations
          </h2>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Invite people to join your organization
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-[13px] font-semibold text-slate-900 mb-4">
            New invitation
          </h3>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="sarah@company.com"
                  className="text-[13px]"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="text-[12px] text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger id="role" className="text-[13px] w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" className="text-[12px] h-8">
                <Send className="w-3 h-3 mr-1" /> Send Invite
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[12px] h-8"
                onClick={reset}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
