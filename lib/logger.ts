/**
 * Logger utility for M5Live
 * Provides configurable logging levels and context-based logging
 */

export enum LogLevel {
  NONE = 0,   // No logging
  ERROR = 1,  // Only errors
  WARN = 2,   // Errors and warnings
  INFO = 3,   // Errors, warnings, and info
  DEBUG = 4   // All logs including debug
}

// Default to NONE in development and production
const DEFAULT_LOG_LEVEL = LogLevel.NONE;

// Store the current log level
let currentLogLevel = DEFAULT_LOG_LEVEL;

// Store whether worklet logging is enabled
let workletLoggingEnabled = false;

/**
 * Configure the logger
 * @param level The log level to set
 * @param enableWorkletLogs Whether to enable worklet-specific logs
 */
export function configureLogger(level: LogLevel, enableWorkletLogs: boolean = false) {
  currentLogLevel = level;
  workletLoggingEnabled = enableWorkletLogs;
  
  // Only log configuration change if we're at INFO level or higher
  if (level >= LogLevel.INFO) {
    console.info(`[M5Live] Logger configured: level=${LogLevel[level]}, workletLogs=${enableWorkletLogs}`);
  }
}

/**
 * Get the current log level
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

/**
 * Check if worklet logging is enabled
 */
export function isWorkletLoggingEnabled(): boolean {
  return workletLoggingEnabled;
}

/**
 * Log a debug message
 * @param context The logging context (e.g., 'MusicV', 'UI')
 * @param message The message to log
 * @param args Additional arguments to log
 */
export function debug(context: string, message: string, ...args: any[]) {
  if (currentLogLevel >= LogLevel.DEBUG) {
    console.debug(`[${context}] ${message}`, ...args);
  }
}

/**
 * Log an info message
 * @param context The logging context (e.g., 'MusicV', 'UI')
 * @param message The message to log
 * @param args Additional arguments to log
 */
export function info(context: string, message: string, ...args: any[]) {
  if (currentLogLevel >= LogLevel.INFO) {
    console.info(`[${context}] ${message}`, ...args);
  }
}

/**
 * Log a warning message
 * @param context The logging context (e.g., 'MusicV', 'UI')
 * @param message The message to log
 * @param args Additional arguments to log
 */
export function warn(context: string, message: string, ...args: any[]) {
  if (currentLogLevel >= LogLevel.WARN) {
    console.warn(`[${context}] ${message}`, ...args);
  }
}

/**
 * Log an error message
 * @param context The logging context (e.g., 'MusicV', 'UI')
 * @param message The message to log
 * @param args Additional arguments to log
 */
export function error(context: string, message: string, ...args: any[]) {
  if (currentLogLevel >= LogLevel.ERROR) {
    console.error(`[${context}] ${message}`, ...args);
  }
}

/**
 * Create a worklet-specific log string that will only be included if worklet logging is enabled
 * @param message The message to include in the worklet code
 * @returns A string that can be included in the worklet code
 */
export function workletLog(message: string): string {
  return `
  if (typeof self !== 'undefined' && self.M5LIVE_WORKLET_LOGGING_ENABLED) {
    console.log(${JSON.stringify(message)});
  }
  `;
}

// Export a default logger object for convenience
export default {
  configure: configureLogger,
  getLevel: getLogLevel,
  isWorkletLoggingEnabled,
  debug,
  info,
  warn,
  error,
  workletLog
}; 