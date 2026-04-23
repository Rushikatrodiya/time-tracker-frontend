import { create } from "zustand";

export const useTimerStore = create((set) => ({
  activeTimer: null, // { taskId, startTime }

  startTimer: (taskId, startTime) =>
    set({ activeTimer: { taskId: String(taskId), startTime } }),

  stopTimer: () => set({ activeTimer: null }),

  isTimerActive: (taskId) => false, // derived, not used directly
}));
