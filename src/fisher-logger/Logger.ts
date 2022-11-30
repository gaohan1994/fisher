import { PrefixLogger } from './PrefixLogger';
import { LoggerMonitor } from './LoggerMonitor';
import { ILoggerConfig, LoggerLevel, LoggerColorMap } from './type';
import { LoggerLevelPriority, randomPick } from './Utilts';

const loggerDefaultOptions: ILoggerConfig = {
  level: LoggerLevel.INFO,
};

const map: LoggerColorMap = {};

export class Logger {
  static instance: Logger | null;

  // prettier-ignore
  static colors = [ "#0a0", "#0a5", "#0aa", "#0af", "#0f0", "#0f5", "#0fa", "#0ff", "#5a0", "#5a5", "#5aa", "#5af", "#5f0", "#5f5", "#5fa", "#5ff", "#aa0", "#aa5", "#aaa", "#aaf", "#af0", "#af5", "#afa", "#aff", "#f0f", "#f50", "#f55", "#f5a", "#f5f", "#fa0", "#fa5", "#faa", "#faf", "#ff0", "#ff5", "#ffa", "#fff", "#05f", "#55f", "#a0f", "#a50", "#a55", "#a5a", "#a5f", "#f00", "#f05", "#f0a"];
  private level: LoggerLevel;
  private _LoggerMonitor: LoggerMonitor;

  constructor(initialOptions: ILoggerConfig = loggerDefaultOptions) {
    this.level = initialOptions.level;
    this._LoggerMonitor = new LoggerMonitor();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Logger(loggerDefaultOptions);
    }
    return this.instance;
  }

  /**
   * 随机获取一个颜色
   * @returns
   */
  public getColor = (prefix: string) =>
    map[prefix] ||
    Object.assign(map, { [prefix]: randomPick(Logger.colors) })[prefix];

  /**
   * 获取带前缀的 Logger 工具
   * @param prefix
   * @returns
   */
  public byPrefix = (prefix: string) =>
    new PrefixLogger({ baseLog: this.log, prefix });

  /**
   * 返回优先级比对接口
   * LTE
   *
   * @param {LoggerLevel} messageLevel
   * @memberof Logger
   */
  public compareLevel = (messageLevel: LoggerLevel, loggerLevel: LoggerLevel) =>
    LoggerLevelPriority[messageLevel] <= LoggerLevelPriority[loggerLevel];

  /**
   * 是否打印日志
   * 后续可以加上按级别向上兼容打印，目前全部打印
   * @param level
   * @returns
   */
  public shouldLogMessage = (messageLevel: LoggerLevel) => {
    const loggerLevel = this.getLevel();
    return (
      loggerLevel !== LoggerLevel.OFF &&
      this.compareLevel(messageLevel, loggerLevel)
    );
  };

  /**
   * 打印日志
   * @param level 日志级别
   * @param prefix 日志前缀
   * @param messages 日志内容
   */
  public log = (level: LoggerLevel, prefix: string, ...messages: any[]) => {
    if (!this.shouldLogMessage(level)) {
      return;
    }
    // eslint-disable-next-line no-console
    // @ts-ignore
    console[level](
      `%c[${prefix}]`,
      `color: ${this.getColor(prefix)}`,
      ...messages
    );
    this.loggerMonitor().record(level, prefix, messages);
  };

  public getLevel = () => this.level;

  public loggerMonitor = () => this._LoggerMonitor;
}
