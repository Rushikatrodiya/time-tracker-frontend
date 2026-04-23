import { useEffect, useState } from "react";

export const DurationDisplay = ({
  taskId,
  startTime,
  isActive,
  taskDurations,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) {
      setElapsed(0);
      return;
    }

    const baseDuration = taskDurations[String(taskId)] || 0;
    const tick = () => {
      const currentTime = Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000,
      );
      setElapsed(baseDuration + currentTime);
    };

    tick(); // immediately set
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive, startTime, taskId, taskDurations]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const duration = taskDurations[String(taskId)];
  return (
    <span
      className={`font-mono text-[12px] ${isActive ? "text-blue-600 font-semibold" : "text-slate-500"}`}
    >
      {formatTime(isActive ? elapsed : (duration ?? 0))}
    </span>
  );
};
