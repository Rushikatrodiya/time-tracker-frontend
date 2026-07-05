"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Navbar from "../../../../../components/dashboard/Navbar";
import {
  AddMemberSection,
  MemberList,
} from "../../../../../components/projects/ProjectTeam";
import { useProjectTeam } from "../../../../../hooks/useProjectTeam";
import { useProjectMembers } from "../../../../../hooks/useTeamData";
import { useAuthStore } from "../../../../../store/authStore";

export default function ProjectTeamPage() {
  const params = useParams();
  const projectId = params.projectId;

  // Get current user info to filter them out from available members
  const currentUser = useAuthStore((state) => state.user);

  // State management
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeError, setRemoveError] = useState("");

  // API hooks with proper error handling
  const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
  } = useProjectMembers(projectId);

  // Team mutations
  const { addMember, removeMember } = useProjectTeam(projectId);

  // Memoized computed values for performance
  const currentMemberIds = useMemo(
    () => new Set(members?.map((member) => member.userId) || []),
    [members],
  );

  // Event handlers with clear naming and error handling

  const handleRemoveMember = (member) => {
    setMemberToRemove(member);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    setRemoveError("");

    try {
      await removeMember.mutateAsync(memberToRemove.userId);
      setShowRemoveModal(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove member. Please try again.";
      setRemoveError(errorMessage);
    }
  };

  const cancelRemoveMember = () => {
    setShowRemoveModal(false);
    setMemberToRemove(null);
  };

  return (
    <>
      <Navbar title="Project Team">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </Navbar>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">
              Project Team
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">Manage members</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px]">
              {members?.length || 0} members
            </Badge>
          </div>
        </div>

        <AddMemberSection
          projectId={projectId}
          currentMemberIds={currentMemberIds}
        />
        <MemberList
          members={members}
          isLoading={membersLoading}
          onRemove={handleRemoveMember}
          isRemoving={removeMember.isPending}
          currentUser={currentUser}
        />

        {/* Remove Member Confirmation Modal */}
        <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-semibold">
                  {memberToRemove?.user?.name}
                </span>{" "}
                from the project? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {/* Remove Member Error */}
            {removeError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{removeError}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelRemoveMember}
                disabled={removeMember.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRemoveMember}
                disabled={removeMember.isPending}
              >
                {removeMember.isPending ? "Removing..." : "Remove Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
