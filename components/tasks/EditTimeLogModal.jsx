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
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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

        <DialogFooter>
          <Button onClick={onUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
