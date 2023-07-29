import { LoggerLevel, prefixes } from './constants.js';
import { Logger } from './logger.js';

export const mainLogger = new Logger(prefixes.MAIN, LoggerLevel.INFO);

export const prefixLogger = (...prefixes: Array<string>) => {
  return new Logger(prefixes.join(':'), LoggerLevel.INFO);
};

export * from './logger.js';
export * from './prefix.js';
export * from './constants.js';
