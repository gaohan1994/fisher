import { Logger } from './Logger';
import { PrefixLogger } from './PrefixLogger';

export const mainLogger = Logger.getInstance();

export const prefixLogger = (...prefixes: Array<string>): PrefixLogger =>
  mainLogger.byPrefix(prefixes.join(':'));

export const prefixes = {
  PAGES: 'pages',
  COMPONENTS: 'components',
  FISHER_CORE: 'fisher_core',
};
