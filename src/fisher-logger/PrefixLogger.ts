import { ILoggerMethodLog, IPrefixLoggerConfig, LoggerLevel } from './type';

class PrefixLogger {
  /**
   * 基本打印日志工具
   *
   * @private
   * @type {ILoggerMethodLog}
   * @memberof PrefixLogger
   */
  private baseLog: ILoggerMethodLog;

  /**
   * 打印日志前缀
   *
   * @private
   * @type {string}
   * @memberof PrefixLogger
   */
  private prefix: string;

  constructor(prefixLoggerOptions: IPrefixLoggerConfig) {
    this.baseLog = prefixLoggerOptions.baseLog;
    this.prefix = prefixLoggerOptions.prefix;
  }

  public log = (level: LoggerLevel, ...messages: any[]) => {
    return this.baseLog(level, this.prefix, ...messages);
  };

  public error = (...messages: any[]) => {
    return this.log(LoggerLevel.ERROR, ...messages);
  };

  public info = (...messages: any[]) => {
    return this.log(LoggerLevel.INFO, ...messages);
  };

  public debug = (...messages: any[]) => {
    return this.log(LoggerLevel.DEBUG, ...messages);
  };
}

export { PrefixLogger };
