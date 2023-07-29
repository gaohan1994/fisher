import { Logger } from './logger.js';
import { Prefix } from './prefix.js';

export const mainLogger = Logger.create();

export const prefixLogger = (...prefixes: Array<string>): Prefix => {
  return mainLogger.byPrefix(prefixes.join(':'));
};

export const prefixes = {
  PAGES: 'Pages',
  COMPONENTS: 'Components',
  FISHER_CORE: 'FisherCore',
};
