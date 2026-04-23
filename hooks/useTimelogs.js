import { useState } from "react";
import api from "../lib/api";
import { toLocalDisplay } from "../utils/parseDateTime";

export const useTimelogs = (tasksData) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [timelogsData, setTimelogsData] = useState({});

  const fetchTimelogsForTask = async (taskId) => {
    try {
      const response = await api.get(`/timelogs/${taskId}`);

      const processedLogs = response.data.data.timeLogs
        .filter((log) => log.endTime !== null) // ← remove active/incomplete session
        .map((log) => ({
          ...log,
          startTime: toLocalDisplay(log.startTime),
          endTime: toLocalDisplay(log.endTime),
        }));

      setTimelogsData((prev) => ({
        ...prev,
        [taskId]: processedLogs,
      }));
    } catch (error) {
      console.error("Error fetching timelogs:", error);
    }
  };

  const toggleRow = async (taskId) => {
    const newExpanded = new Set(expandedRows);

    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);

      // Only fetch if not already cached
      if (!timelogsData[taskId]) {
        await fetchTimelogsForTask(taskId);
      }
    }

    setExpandedRows(newExpanded);
  };

  // Clears cached timelogs for a task, forcing refetch on next expand
  const invalidateTaskTimelogs = (taskId, timeLogId) => {
    setTimelogsData((prev) => {
      const updated = { ...prev };
      if (updated[taskId]) {
        updated[taskId] = updated[taskId].filter((log) => log.id !== timeLogId);
      }
      return updated;
    });
  };

  // Builds the subtask rows from cached timelogs data
  const getSubTasksForTask = (taskId) => {
    const logs = timelogsData[taskId];

    if (!logs || logs.length === 0) {
      return [
        {
          id: `${taskId}-empty`,
          title: "No time sessions found",
          startTime: "--",
          endTime: "--",
          duration: 0,
          isEmpty: true,
        },
      ];
    }

    return logs.map((log, index) => ({
      id: log.id,
      title: `Time session ${index + 1}`,
      startTime: log.startTime || "--",
      endTime: log.endTime || "--",
      originalStartTime: log.startTime,
      originalEndTime: log.endTime,
      duration: log.duration || 0,
      isEmpty: false,
    }));
  };

  return {
    expandedRows,
    toggleRow,
    getSubTasksForTask,
    invalidateTaskTimelogs,
    fetchTimelogsForTask,
  };
};
