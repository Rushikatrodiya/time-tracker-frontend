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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Trash2 } from "lucide-react";
import { useState } from "react";
import Navbar from "../../../components/dashboard/Navbar";
import { useCreateEntity } from "../../../hooks/useCreateEntity";
import { useInvitationForm } from "../../../hooks/useInvitationForm";
import useQueryHook from "../../../hooks/useQuery";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";

export default function UsersPage() {
  const [invitationToRevoke, setInvitationToRevoke] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);

  const currentUser = useAuthStore((state) => state.user);

  const mutation = useCreateEntity(
    (data) => api.post("/invitations", data),
    ["invitations"],
  );

  const revokeInvitation = useCreateEntity(
    (inviteId) => api.delete(`/invitations/${inviteId}`),
    ["invitations"],
  );

  const removeUserMutation = useCreateEntity(
    (userId) => api.delete(`/users/${userId}`),
    [["users"], ["project-members"], ["team", "summary"], ["team", "overview"], ["tasks"]],
  );

  const { data: invitationsData, isLoading: isLoadingInvitations } = useQueryHook({
    key: ["invitations"],
    fn: () => api.get("/invitations"),
    select: (res) => res.data.data || res.data,
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQueryHook({
    key: ["users"],
    fn: () => api.get("/users"),
    select: (res) => res.data.data || res.data,
  });

  const { form, errors, handleChange, handleSubmit, reset } = useInvitationForm({
    onSubmit: (data) => {
      mutation.mutate(data, {
        onSuccess: () => reset(),
      });
    },
  });

  const getInvitationStatus = (invitation) => {
    if (invitation.usedAt) return "Accepted";
    if (new Date(invitation.expiresAt) < new Date()) return "Expired";
    return "Pending";
  };

  const handleRevokeInvitation = (invitation) => {
    setInvitationToRevoke(invitation);
    revokeInvitation.reset();
  };

  const confirmRevokeInvitation = () => {
    if (!invitationToRevoke) return;
    revokeInvitation.mutate(invitationToRevoke.id, {
      onSuccess: () => setInvitationToRevoke(null),
    });
  };

  const cancelRevokeInvitation = () => {
    setInvitationToRevoke(null);
    revokeInvitation.reset();
  };

  const handleRemoveUser = (user) => {
    setUserToRemove(user);
    removeUserMutation.reset();
  };

  const confirmRemoveUser = () => {
    if (!userToRemove) return;
    removeUserMutation.mutate(userToRemove.id, {
      onSuccess: () => setUserToRemove(null),
    });
  };

  const cancelRemoveUser = () => {
    setUserToRemove(null);
    removeUserMutation.reset();
  };

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

            {mutation.isError && (
              <p className="text-[12px] text-red-500">
                {mutation.error?.response?.data?.message ||
                  "Failed to send invite. Please try again."}
              </p>
            )}

            {mutation.isSuccess && (
              <p className="text-[12px] text-green-600">
                Invitation sent successfully.
              </p>
            )}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                size="sm"
                className="text-[12px] h-8"
                disabled={mutation.isPending}
              >
                <Send className="w-3 h-3 mr-1" />
                {mutation.isPending ? "Sending..." : "Send Invite"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[12px] h-8"
                onClick={reset}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Active Users Table */}
        <div className="bg-white border border-slate-200 rounded-lg mt-6">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[13px] font-semibold text-slate-900">
              Active Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {["Name", "Email", "Role", "Joined At", "Actions"].map((label) => (
                    <th
                      key={label}
                      className="text-left p-4 text-[13px] font-semibold text-slate-900"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[13px] text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : usersData?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[13px] text-slate-400">
                      No active users found
                    </td>
                  </tr>
                ) : (
                  usersData?.map((userItem) => (
                    <tr key={userItem.id} className="border-b border-slate-100">
                      <td className="p-4 text-[13px] text-slate-700">
                        {userItem.name}
                      </td>
                      <td className="p-4 text-[13px] text-slate-700">
                        {userItem.email}
                      </td>
                      <td className="p-4 text-[13px] text-slate-700">
                        {userItem.role}
                      </td>
                      <td className="p-4 text-[13px] text-slate-700">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-[13px] text-slate-700">
                        {String(currentUser?.id) !== String(userItem.id) && userItem.role !== "ADMIN" ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-7 text-[12px]"
                            onClick={() => handleRemoveUser(userItem)}
                            disabled={removeUserMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {removeUserMutation.isPending && userToRemove?.id === userItem.id
                              ? "Removing..."
                              : "Remove"}
                          </Button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg mt-6">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[13px] font-semibold text-slate-900">
              Sent Invitations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {["Email", "Role", "Status", "Expires At", "Actions"].map((label) => (
                    <th
                      key={label}
                      className="text-left p-4 text-[13px] font-semibold text-slate-900"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoadingInvitations ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[13px] text-slate-400">
                      Loading invitations...
                    </td>
                  </tr>
                ) : invitationsData?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[13px] text-slate-400">
                      No invitations sent yet
                    </td>
                  </tr>
                ) : (
                  invitationsData?.map((invitation) => {
                    const status = getInvitationStatus(invitation);
                    const canRevoke = status === "Pending";
                    const isRevoking =
                      revokeInvitation.isPending &&
                      invitationToRevoke?.id === invitation.id;

                    return (
                      <tr key={invitation.id} className="border-b border-slate-100">
                        <td className="p-4 text-[13px] text-slate-700">
                          {invitation.email}
                        </td>
                        <td className="p-4 text-[13px] text-slate-700">
                          {invitation.role}
                        </td>
                        <td className="p-4 text-[13px] text-slate-700">
                          {status}
                        </td>
                        <td className="p-4 text-[13px] text-slate-700">
                          {new Date(invitation.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-[13px] text-slate-700">
                          {canRevoke ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="h-7 text-[12px]"
                              onClick={() => handleRevokeInvitation(invitation)}
                              disabled={revokeInvitation.isPending}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              {isRevoking ? "Revoking..." : "Revoke"}
                            </Button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={!!invitationToRevoke} onOpenChange={(open) => !open && cancelRevokeInvitation()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Revoke Invitation</DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke the invitation for{" "}
                <span className="font-semibold">
                  {invitationToRevoke?.email}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {revokeInvitation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {revokeInvitation.error?.response?.data?.message || revokeInvitation.error?.message || "Failed to revoke invite."}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelRevokeInvitation}
                disabled={revokeInvitation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRevokeInvitation}
                disabled={revokeInvitation.isPending}
              >
                {revokeInvitation.isPending ? "Revoking..." : "Revoke Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove User Modal */}
        <Dialog open={!!userToRemove} onOpenChange={(open) => !open && cancelRemoveUser()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove User</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-semibold">{userToRemove?.name}</span>?
                They will be completely removed from the organization. All their tasks will be unassigned and they will lose access to all projects. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {removeUserMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {removeUserMutation.error?.response?.data?.message || removeUserMutation.error?.message || "Failed to remove user."}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelRemoveUser}
                disabled={removeUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRemoveUser}
                disabled={removeUserMutation.isPending}
              >
                {removeUserMutation.isPending ? "Removing..." : "Remove User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
