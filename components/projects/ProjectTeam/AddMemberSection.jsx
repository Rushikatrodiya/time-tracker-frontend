import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useProjectTeam } from "../../../hooks/useProjectTeam";
import { useOrganizationMembers } from "../../../hooks/useTeamData";
import { useAuthStore } from "../../../store/authStore";

const SEARCH_PLACEHOLDER = "Search organization members...";

export default function AddMemberSection({ projectId, currentMemberIds }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [addError, setAddError] = useState("");

  const currentUser = useAuthStore((state) => state.user);
  const { addMember } = useProjectTeam(projectId);
  
  const {
    data: organizationMembers,
    isLoading: orgLoading,
  } = useOrganizationMembers(currentUser?.organizationId);

  const availableMembers = organizationMembers?.filter((member) => {
    const isNotCurrentMember = !currentMemberIds.has(member.id);
    const isNotCurrentUser = member.id !== currentUser?.id;
    const isNotAdmin = member.role !== "ADMIN";
    const matchesSearch =
      !searchTerm ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      isNotCurrentMember && isNotCurrentUser && isNotAdmin && matchesSearch
    );
  }) || [];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleAddMember = async () => {
    if (!selectedMember) return;

    setAddError("");

    try {
      await addMember.mutateAsync(Number(selectedMember.id));
      setSelectedMember(null);
      setSearchTerm("");
      setShowAddSection(false);
    } catch (error) {
      console.error("Failed to add member:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add member. Please try again.";
      setAddError(errorMessage);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedMember(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <UserPlus className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-900">
              Add Team Member
            </p>
            <p className="text-xs text-slate-500">
              Search and add organization members
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddSection(!showAddSection)}
        >
          {showAddSection ? "Cancel" : "Add Member"}
        </Button>
      </div>

      {showAddSection && (
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              key="search-input"
              type="text"
              placeholder={SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Results */}
          <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
            {orgLoading ? (
              <div className="p-4 text-center text-sm text-slate-500">
                Loading members...
              </div>
            ) : availableMembers.length > 0 ? (
              availableMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className={`p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0 ${
                    selectedMember?.id === member.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-slate-500 text-white text-xs">
                        {member.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {member.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                {organizationMembers
                  ? "No available members found"
                  : "No organization members available"}
              </div>
            )}
          </div>

          {/* Add Button */}
          {selectedMember && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Add {selectedMember.name} to the team?
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedMember.email}
                  </p>
                </div>
                <Button
                  onClick={handleAddMember}
                  disabled={addMember.isPending}
                  size="sm"
                >
                  {addMember.isPending ? "Adding..." : "Add Member"}
                </Button>
              </div>

              {/* Add Member Error */}
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{addError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
