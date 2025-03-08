import type { LogEntry } from "../types/log";

// Simple console-based logger
const logger = {
  info: (obj: Record<string, unknown>, msg?: string) => {
    console.info(msg || 'INFO:', obj);
  },
  error: (msg: string, error?: unknown) => {
    console.error(msg, error || '');
  },
  warn: (msg: string, obj?: Record<string, unknown>) => {
    console.warn(msg, obj || '');
  },
  debug: (msg: string, obj?: Record<string, unknown>) => {
    console.debug(msg, obj || '');
  }
};

export const useLogger = () => {
  const config = useRuntimeConfig();

  const logActivity = async (
    type: string,
    details: Record<string, unknown>
  ) => {
    // Log locally
    logger.info({ type, ...details }, `Activity: ${type}`);

    try {
      // Send to backend
      const response = await fetch(`${config.public.apiBase}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          timestamp: new Date().toISOString(),
          details,
        }),
      });

      if (!response.ok) {
        logger.error("Failed to send log to backend");
      }
    } catch (error) {
      logger.error("Error sending log to backend:", error);
    }
  };

  const getLogs = async (): Promise<LogEntry[]> => {
    try {
      const response = await fetch(`${config.public.apiBase}/log`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      return await response.json();
    } catch (error) {
      logger.error("Error fetching logs:", error);
      return [];
    }
  };

  return {
    logger,
    logActivity,
    getLogs,
  };
}; 