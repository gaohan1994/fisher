import { Logger } from './Logger';
import { PrefixLogger } from './PrefixLogger';

export const mainLogger = Logger.getInstance();

export const prefixLogger = (...prefixes: Array<string>): PrefixLogger =>
  mainLogger.byPrefix(prefixes.join(':'));

export const prefixes = {
  PAGES: 'Pages',
  COMPONENTS: 'Components',
  FISHER_CORE: 'FisherCore',
};
