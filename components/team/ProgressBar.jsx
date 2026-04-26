import { getProgressColor } from "../../utils/teamHelpers";

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
