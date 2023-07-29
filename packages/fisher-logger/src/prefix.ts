import { LoggerLevel } from './constants.js';

interface BaseLogInterface {
  (level: LoggerLevel, prefix: string, ...messages: any[]): any;
}

class Prefix {
  constructor(
    /**
     * Basic log utils
     * @method baseLog
     */
    private baseLog: BaseLogInterface,

    /**
     * The prefix will inject
     * @param prefix
     */
    private prefix: string
  ) {}

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

export { Prefix };
