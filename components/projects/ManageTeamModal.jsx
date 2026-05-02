"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { useProjectTeam } from "../../hooks/useProjectTeam";
import { useProjectMembers } from "../../hooks/useTeamData";
import { MemberList } from "./ProjectTeam";

export default function ManageTeamModal({ open, onOpenChange, project }) {
  const { data: members, isLoading } = useProjectMembers(project?.id);
  const { addMember, removeMember } = useProjectTeam(project?.id);

  const handleRemoveMember = (member) => {
    removeMember.mutate(member.userId);
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Team - {project.name}
          </DialogTitle>
          <DialogDescription>
            Add or remove team members from this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Members */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              Current Members ({members?.length || 0})
            </h3>
            <MemberList
              members={members}
              isLoading={isLoading}
              onRemove={handleRemoveMember}
              isRemoving={removeMember.isPending}
              compact={true}
            />
          </div>

          {/* Add New Member Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">
              Add New Member
            </h3>
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg">
              <div className="text-center text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Use the main team page to add members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
