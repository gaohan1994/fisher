import { LoggerStorage } from './storage.js';
import { LoggerLevel } from './constants.js';

interface IFormatLog {
  level: LoggerLevel;
  prefix: string;
  time: string;
  messages: any;
}

const MAX_LOGGER_SIZE = 200;
const DELETE_OUTSIZE_LOGGER_NUMBER = 50;
const LOGGER_MAJOR_STORE_NAME = 'logger_info';
const LOGGER_ERROR_STORE_NAME = 'logger_error';
const DEFAULT_STORE_NAME = [LOGGER_MAJOR_STORE_NAME, LOGGER_ERROR_STORE_NAME];
const RECORD_MAX_LIFE = 1000 * 60 * 60 * 24 * 7;

const matchLoggerStore: Record<LoggerLevel, string> = {
  [LoggerLevel.OFF]: LOGGER_MAJOR_STORE_NAME,
  [LoggerLevel.INFO]: LOGGER_MAJOR_STORE_NAME,
  [LoggerLevel.ERROR]: LOGGER_ERROR_STORE_NAME,
  [LoggerLevel.DEBUG]: LOGGER_MAJOR_STORE_NAME,
};

function checkLogsIsOutsize(logs: Array<IFormatLog>): boolean {
  return logs.length >= MAX_LOGGER_SIZE;
}

function format(level: LoggerLevel, prefix: string, messages: any[]) {
  return {
    level,
    prefix,
    messages,
    time: new Date().toISOString(),
  };
}

/**
 *  日志管理工具
 *
 * 使用 storage 存放 logger
 * 按照日志级别存储 目前暂定2个存储级别
 *
 * - _LOG_INFO
 * - _LOG_ERROR
 *
 * 每个 storage 可最大存放 1MB 内容
 *
 * 每次存放日志之前应该按照
 * - 建立 storage 连接
 * - 删除超时的内容
 * - 删除超过最大存放限制的内容
 * - 存放当次日志
 * - 错误处理
 *
 * @class LoggerMonitor
 */
class Monitor {
  private storeNames = DEFAULT_STORE_NAME;
  private recordMaxLife = RECORD_MAX_LIFE;

  constructor() {
    this.initialize();
  }

  /**
   * 初始化日志存储仓库
   *
   * @private
   * @memberof LoggerMonitor
   */
  private initialize = (): void => {
    this.storeNames.map((storeName: string) => {
      const result = LoggerStorage.getValue(storeName);
      if (!Boolean(result)) {
        LoggerStorage.setValue(storeName, []);
      }
    });
  };

  public record = (level: LoggerLevel, prefix: string, messages: any[]) => {
    const formatMessage = format(level, prefix, messages);
    const storeName = matchLoggerStore[formatMessage.level];
    const logs: Array<IFormatLog> = LoggerStorage.getValue(storeName, []);
    logs.unshift(formatMessage);
    this.deleteOuttimeLogs(logs);
    this.deleteOutsizeLogs(logs);
    LoggerStorage.setValue(storeName, logs);
  };

  public clearLogger = (storeNames?: Array<string>) => {
    const names = storeNames || this.storeNames;
    return Promise.all(names.map((storeName) => LoggerStorage.clearValue(storeName, [])));
  };

  private deleteOuttimeLogs = async (logs: Array<IFormatLog>): Promise<Array<IFormatLog>> => {
    const filteredLogs = logs.filter((log) => {
      return new Date().getTime() < new Date(log.time).getTime() + this.recordMaxLife;
    });
    return filteredLogs;
  };

  private deleteOutsizeLogs = async (logs: Array<IFormatLog>): Promise<Array<IFormatLog>> => {
    if (checkLogsIsOutsize(logs)) {
      logs.length = MAX_LOGGER_SIZE - DELETE_OUTSIZE_LOGGER_NUMBER;
      return logs;
    }
    return logs;
  };
}

export { Monitor };
