import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

export const TimerButton = ({
  taskId,
  isActive,
  isPending,
  isOtherTimerActive,
  onStart,
  onStop,
}) => {
  const handleClick = (e) => {
    if (isActive) {
      onStop(taskId, e);
    } else if (!isOtherTimerActive) {
      onStart(taskId, e);
    }
  };

  return (
    <Button
      size="sm"
      variant={
        isActive ? "destructive" : isOtherTimerActive ? "secondary" : "outline"
      }
      className={`h-7 px-2 text-[11px] ${
        isActive
          ? "bg-red-600 hover:bg-red-700 text-white"
          : isOtherTimerActive
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
            : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
      }`}
      onClick={handleClick}
      disabled={isPending || isOtherTimerActive}
      title={isOtherTimerActive ? "Only one timer can run at a time" : ""}
    >
      {isActive ? (
        <>
          <Square className="w-3 h-3 mr-1" />
          Stop
        </>
      ) : (
        <>
          <Play className="w-3 h-3 mr-1" />
          Start
        </>
      )}
    </Button>
  );
};
