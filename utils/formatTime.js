/**
 * Formats seconds into HH:MM:SS string
 * @param {number} seconds
 * @returns {string} "HH:MM:SS"
 */
export const formatTime = (seconds) => {
  if (seconds == null) return "00:00:00";
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};
