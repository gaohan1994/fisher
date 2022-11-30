import { FisherStorage } from './FisherStorage';
import {
  IFormatLog,
  ILoggerMonitorImplements,
  LoggerLevel,
  LoggerMonitorNames,
} from './type';

const MAX_LOGGER_SIZE = 200;
const DELETE_OUTSIZE_LOGGER_NUMBER = 50;

const checkLogsIsOutsize = (logs: Array<IFormatLog>): boolean =>
  logs.length >= MAX_LOGGER_SIZE;

const defaultLoggerMonitorOptions = {
  storeNames: [LoggerMonitorNames.ERROR, LoggerMonitorNames.INFO],
  recordMaxLife: 1000 * 60 * 60 * 24 * 7,
};

const matchLoggerStore = {
  [LoggerLevel.OFF]: LoggerMonitorNames.INFO,
  [LoggerLevel.INFO]: LoggerMonitorNames.INFO,
  [LoggerLevel.ERROR]: LoggerMonitorNames.ERROR,
  [LoggerLevel.DEBUG]: LoggerMonitorNames.INFO,
};

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
class LoggerMonitor implements ILoggerMonitorImplements {
  private storeNames: Array<LoggerMonitorNames>;
  private recordMaxLife = 0;
  /**
   * logger 记录队列，防止大量log同时存储
   *
   * @private
   * @type {Promise<void>}
   * @memberof LoggerMonitor
   */
  private recordPromise: Promise<void>;

  constructor(options = defaultLoggerMonitorOptions) {
    this.storeNames = options.storeNames;
    this.recordMaxLife = options.recordMaxLife;
    this.recordPromise = Promise.resolve();
    this.initialize();
  }

  /**
   * 格式化日志信息
   *
   * @param {*} level
   * @param {*} prefix
   * @param {*} messages
   * @memberof LoggerMonitor
   */
  public format = (level: LoggerLevel, prefix: string, messages: any[]) => ({
    level,
    prefix,
    messages,
    time: new Date().toISOString(),
  });

  public record = async (
    level: LoggerLevel,
    prefix: string,
    messages: any[]
  ) => {
    this.recordPromise = new Promise((resolve, reject) => {
      this.recordPromise.then(() => {
        const formatMessage = this.format(level, prefix, messages);
        const storeName = matchLoggerStore[formatMessage.level];
        const prevLogs: Array<IFormatLog> = FisherStorage.getValue(
          storeName,
          []
        );
        Promise.resolve((prevLogs as any) === '' ? [] : prevLogs)
          .then((logs) => {
            const nextLogs = [formatMessage, ...logs];
            FisherStorage.setValue(storeName, nextLogs);
            setTimeout(() => {
              resolve();
            }, 200);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to record', error);
            reject();
          });
      });
    });
  };

  /**
   * 清除日志
   *
   * @param {*} storeNames
   * @memberof LoggerMonitor
   */
  public clearLogger = (storeNames?: Array<LoggerMonitorNames>) => {
    const names = storeNames || this.storeNames;
    return Promise.all(
      names.map((storeName) => FisherStorage.clearValue(storeName, []))
    );
  };

  public getLogs = (): Array<IFormatLog> => {
    return this.storeNames
      .map<IFormatLog>((store) => FisherStorage.getValue(store))
      .flat();
  };

  public remoteLogger = () => {
    return Promise.resolve();
  };

  public getRecordMaxLife = () => this.recordMaxLife;

  /**
   * 初始化日志存储仓库
   *
   * @private
   * @memberof LoggerMonitor
   */
  private initialize = (): Promise<any> => {
    const initLoggerStore = (storeName: string) => {
      const result = FisherStorage.getValue(storeName);
      if (result === '') {
        FisherStorage.setValue(storeName, []);
      }
    };
    return Promise.all([this.storeNames.map(initLoggerStore)]);
  };

  /**
   * 移除过期的日志
   *
   * @private
   * @param {Array<IFormatLog>} logs
   * @memberof LoggerMonitor
   */
  private deleteOuttimeLogs = async (
    logs: Array<IFormatLog>
  ): Promise<Array<IFormatLog>> => {
    const filteredLogs = logs.filter((log) => {
      return (
        new Date().getTime() <
        new Date(log.time).getTime() + this.getRecordMaxLife()
      );
    });
    return filteredLogs;
  };

  /**
   * 删除超过 MAX_LOGGER_SIZE 条的记录 每次删除 DELETE_OUTSIZE_LOGGER_NUMBER 条
   *
   * @private
   * @param {Array<IFormatLog>} logs
   * @memberof LoggerMonitor
   */
  private deleteOutsizeLogs = async (
    logs: Array<IFormatLog>
  ): Promise<Array<IFormatLog>> => {
    if (checkLogsIsOutsize(logs)) {
      logs.length = MAX_LOGGER_SIZE - DELETE_OUTSIZE_LOGGER_NUMBER;
      return logs;
    }
    return logs;
  };
}

export { LoggerMonitor };
