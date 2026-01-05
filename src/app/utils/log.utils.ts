type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  data?: unknown;
  prefix?: string;
  group?: boolean;
}

export function logInfo(message: string, options?: LogOptions): void {
  const {
    level = 'info',
    data,
    prefix = 'LOG',
    group = false
  } = options || {};

  const logMethod = console[level] || console.log;
  const fullPrefix = `[${prefix}]`;

  if (group) {
    console.group(fullPrefix, message);
    if (data !== undefined) {
      logMethod(data);
    }
    console.groupEnd();
  } else {
    if (data !== undefined) {
      logMethod(fullPrefix, message, data);
    } else {
      logMethod(fullPrefix, message);
    }
  }
}

