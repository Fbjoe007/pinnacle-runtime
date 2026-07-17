import { useState, useEffect, useRef } from "react";
import { getExecutionById, ExecutionResponse } from "../api";

export const useExecution = (executionId: string | null) => {
  const [data, setData] = useState<ExecutionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = async () => {
    if (!executionId) return;
    try {
      const response = await getExecutionById(executionId);
      setData(response);
      if (response.execution && ["SUCCEEDED", "FAILED", "CANCELLED"].includes(response.execution.state)) {
        stopPolling();
      }
    } catch (err) {
      setError("Runtime Connection Lost");
      stopPolling();
    }
  };

  const stopPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
      setIsLive(false);
    }
  };

  useEffect(() => {
    if (!executionId) return;
    setIsLive(true);
    fetchStatus();
    pollInterval.current = setInterval(fetchStatus, 2000);
    return () => stopPolling();
  }, [executionId]);

  return { data, error, isLive, stopPolling };
};
