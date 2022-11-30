/**
 * 打印日志级别
 *
 * @export
 * @enum {number}
 */
export enum LoggerLevel {
  OFF = 'off',
  INFO = 'info',
  ERROR = 'error',
  DEBUG = 'debug',
}

/**
 * 创建 Logger 工具参数
 *
 * @export
 * @interface ILoggerConfig
 */
export interface ILoggerConfig {
  /**
   * Logger 日志级别
   *
   * @type {LoggerLevel}
   * @memberof ILoggerConfig
   */
  level: LoggerLevel;
}

/**
 * 基础打印日志接口
 *
 * @export
 * @interface LoggerMethodLog
 */
export interface ILoggerMethodLog {
  (level: LoggerLevel, prefix: string, ...messages: any[]): any;
}

/**
 * 创建 prefix logger 的参数
 *
 * @export
 * @interface IPrefixLoggerConfig
 */
export interface IPrefixLoggerConfig {
  baseLog: ILoggerMethodLog;
  prefix: string;
}

/**
 * 颜色缓存map
 *
 * @export
 * @interface LoggerColorMap
 */
export interface LoggerColorMap {
  [key: string]: string;
}

export enum LoggerMonitorNames {
  INFO = 'LOGGER_INFO',
  ERROR = 'LOGGER_ERROR',
}

export interface IFormatLog {
  level: LoggerLevel;
  prefix: string;
  time: string;
  messages: any;
}

interface ILoggerFormat {
  (level: LoggerLevel, prefix: string, ...messages: any[]): IFormatLog;
}

/**
 * 记录一条日志
 *
 * @interface ILoggerMonitorRecord
 */
interface ILoggerMonitorRecord {
  (level: LoggerLevel, prefix: string, ...messages: any[]): Promise<any>;
}

/**
 * 清空Logger日志
 *
 * @interface ILoggerMonitorClearLogger
 */
interface ILoggerMonitorClearLogger {
  (storeNames?: Array<LoggerMonitorNames>): Promise<any>;
}

interface ILoggerMonitorRemoveLogger {
  (): Promise<any>;
}

export interface ILoggerMonitorImplements {
  format: ILoggerFormat;
  record: ILoggerMonitorRecord;
  clearLogger: ILoggerMonitorClearLogger;
  remoteLogger: ILoggerMonitorRemoveLogger;
}
