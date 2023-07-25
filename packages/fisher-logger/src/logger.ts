import { makeAutoObservable } from 'mobx';
import { Prefix } from './prefix';
import { Monitor } from './monitor';
import { LoggerLevel, LoggerLevelPriority, colors } from './constants';

function randomPick<T>(items: Array<T>): T {
  return items[Math.floor(Math.random() * items.length)];
}

const DefaultLoggerLevel = LoggerLevel.INFO;

export class Logger {
  static instance: Logger | null;

  private map = new Map<string, string>();

  private monitor = new Monitor();

  constructor(private level: LoggerLevel) {
    makeAutoObservable(this);
  }

  static create() {
    if (!this.instance) {
      this.instance = new Logger(DefaultLoggerLevel);
    }
    return this.instance;
  }

  public getColor = (prefix: string) => {
    if (this.map.has(prefix)) {
      return this.map.get(prefix)!;
    }
    const color = randomPick(colors);
    this.map.set(prefix, color);
    return color;
  };

  /**
   * @param prefix
   * @returns
   */
  public byPrefix = (prefix: string) => {
    return new Prefix(this.log, prefix);
  };

  /**
   * Set logger level
   * @param level
   */
  public setLevel = (level: LoggerLevel) => {
    this.level = level;
  };

  /**
   * 返回优先级比对接口
   * LTE
   *
   * @param {LoggerLevel} messageLevel
   * @memberof Logger
   */
  public compareLevel = (messageLevel: LoggerLevel, loggerLevel: LoggerLevel) => {
    return LoggerLevelPriority[messageLevel] <= LoggerLevelPriority[loggerLevel];
  };

  /**
   * 是否打印日志
   * 后续可以加上按级别向上兼容打印，目前全部打印
   * @param level
   * @returns
   */
  public shouldLogMessage = (messageLevel: LoggerLevel) => {
    return this.level !== LoggerLevel.OFF && this.compareLevel(messageLevel, this.level);
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
    console[level](`%c[${prefix}]`, `color: ${this.getColor(prefix)}`, ...messages);
    this.monitor.record(level, prefix, messages);
  };
}
