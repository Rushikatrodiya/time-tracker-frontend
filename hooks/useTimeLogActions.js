import { useState } from "react";
import api from "../lib/api";
import { parseToLocalInput } from "../utils/parseDateTime";
import { useCreateEntity } from "./useCreateEntity";

export const useTimeLogActions = (invalidateTaskTimelogs, refetchDurations) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTimeLog, setSelectedTimeLog] = useState(null);
  const [editingTimeLog, setEditingTimeLog] = useState({});

  const updateTimeLogMutation = useCreateEntity(
    (data) =>
      api.put(`/timelogs/${data.timeLogId}`, {
        taskId: data.taskId,
        startTime: data.startTime,
        endTime: data.endTime,
      }),
    ["timelogs"],
  );

  const deleteTimeLogMutation = useCreateEntity(
    (data) => api.delete(`/timelogs/${data.timeLogId}`),
    ["timelogs"],
  );

  const handleEditTimeLog = (timeLog, taskId) => {
    setSelectedTimeLog({ ...timeLog, taskId });
    setEditingTimeLog({
      startTime: parseToLocalInput(timeLog.originalStartTime),
      endTime: parseToLocalInput(timeLog.originalEndTime),
    });
    setEditModalOpen(true);
  };

  const handleUpdateTimeLog = () => {
    const payload = {
      taskId: selectedTimeLog.taskId,
      startTime: new Date(editingTimeLog.startTime).toISOString(),
      endTime: new Date(editingTimeLog.endTime).toISOString(),
    };

    updateTimeLogMutation.mutate(
      { ...payload, timeLogId: selectedTimeLog.id },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setSelectedTimeLog(null);
          setEditingTimeLog({});
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
