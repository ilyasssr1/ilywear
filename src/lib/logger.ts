/**
 * Logger utility
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logs: LogEntry[] = [];

  private formatMessage(level: LogLevel, message: string): string {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  }

  private addLog(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    if (Error) {
      try {
        throw new Error();
      } catch (e) {
        if (e instanceof Error) {
          entry.stack = e.stack;
        }
      }
    }

    this.logs.push(entry);

    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: any): void {
    this.addLog("debug", message, data);
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message), data);
    }
  }

  info(message: string, data?: any): void {
    this.addLog("info", message, data);
    console.info(this.formatMessage("info", message), data);
  }

  warn(message: string, data?: any): void {
    this.addLog("warn", message, data);
    console.warn(this.formatMessage("warn", message), data);
  }

  error(message: string, error?: Error | any): void {
    const data =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
    this.addLog("error", message, data);
    console.error(this.formatMessage("error", message), error);
  }

  getLogs(level?: LogLevel, limit: number = 50): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter((log) => log.level === level);
    }
    return filtered.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Global error handler
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    logger.error("Uncaught error", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled promise rejection", event.reason);
  });
}
