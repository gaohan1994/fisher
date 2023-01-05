import { Logger } from './Logger';
import { PrefixLogger } from './PrefixLogger';

export const mainLogger = Logger.create();

export const prefixLogger = (...prefixes: Array<string>): PrefixLogger =>
  mainLogger.byPrefix(prefixes.join(':'));

export const prefixes = {
  PAGES: 'Pages',
  COMPONENTS: 'Components',
  FISHER_CORE: 'FisherCore',
};

(window as any).logger = mainLogger;
