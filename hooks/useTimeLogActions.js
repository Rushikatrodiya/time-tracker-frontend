import { useState } from "react";
import api from "../lib/api";
import { parseToLocalInput } from "../utils/parseDateTime";
import { useCreateEntity } from "./useCreateEntity";

export const useTimeLogActions = (
  invalidateTaskTimelogs,
  refetchDurations,
  refreshTaskTimelogs,
) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTimeLog, setSelectedTimeLog] = useState(null);
  const [editingTimeLog, setEditingTimeLog] = useState({});

  const updateTimeLogMutation = useCreateEntity(
    (data) =>
      api.put(`/timelogs/${data.timeLogId}`, {
        taskId: data.taskId,
        startTime: data.startTime,
        endTime: data.endTime,
        title: data.description,
      }),
    [["timelogs"], ["team", "summary"], ["team", "overview"]],
  );

  const deleteTimeLogMutation = useCreateEntity(
    (data) => api.delete(`/timelogs/${data.timeLogId}`),
    [["timelogs"], ["team", "summary"], ["team", "overview"]],
  );

  const handleEditTimeLog = (timeLog, taskId, taskTitle) => {
    setSelectedTimeLog({ ...timeLog, taskId });
    setEditingTimeLog({
      startTime: parseToLocalInput(timeLog.originalStartTime),
      endTime: parseToLocalInput(timeLog.originalEndTime),
      description: timeLog.description || taskTitle || "",
    });
    setEditModalOpen(true);
  };

  const handleUpdateTimeLog = () => {
    const payload = {
      taskId: selectedTimeLog.taskId,
      startTime: new Date(editingTimeLog.startTime).toISOString(),
      endTime: new Date(editingTimeLog.endTime).toISOString(),
      description: editingTimeLog.description,
    };

    updateTimeLogMutation.mutate(
      { ...payload, timeLogId: selectedTimeLog.id },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedTimeLog(null);
          setEditingTimeLog({});
          refetchDurations();
          refreshTaskTimelogs(selectedTimeLog.taskId);
        },
      },
    );
  };

  const handleDeleteTimeLog = (timeLog, taskId) => {
    deleteTimeLogMutation.mutate(
      { timeLogId: timeLog.id },
      {
        onSuccess: () => {
          invalidateTaskTimelogs(taskId, timeLog.id);
          refetchDurations();
        },
      },
    );
  };

  const handleFieldChange = (field, value) => {
    setEditingTimeLog((prev) => ({ ...prev, [field]: value }));
  };

  return {
    editModalOpen,
    setEditModalOpen,
    editingTimeLog,
    handleEditTimeLog,
    handleUpdateTimeLog,
    handleDeleteTimeLog,
    handleFieldChange,
  };
};
