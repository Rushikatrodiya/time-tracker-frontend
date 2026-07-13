import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditTimeLogModal({
  open,
  onOpenChange,
  editingTimeLog,
  onFieldChange,
  onUpdate,
  error,
}) {
  // Map backend error messages to user-friendly text
  const getFriendlyError = (message) => {
    if (!message) return null;
    if (message.toLowerCase().includes("overlap")) {
      return "This time range conflicts with another time log you already have. Please adjust the start or end time so they don't overlap.";
    }
    return message;
  };

  const friendlyError = getFriendlyError(error);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Time Log</DialogTitle>
          <DialogDescription>
            Update the start and end time for this time log
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingTimeLog.description || ""}
              onChange={(e) => onFieldChange("description", e.target.value)}
              className="text-[13px] resize-none"
              rows={3}
              placeholder="Enter description..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={editingTimeLog.startTime || ""}
              onChange={(e) => onFieldChange("startTime", e.target.value)}
              className="text-[13px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={editingTimeLog.endTime || ""}
              onChange={(e) => onFieldChange("endTime", e.target.value)}
              className="text-[13px]"
            />
          </div>
        </div>

        {friendlyError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[12px] text-red-700 leading-relaxed">{friendlyError}</p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
