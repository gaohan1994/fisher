import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { prompt } from '../fisher-prompt';
import { EventKeys, events } from '../fisher-events';
import { ArchiveInterface } from '../fisher-archive';

/**
 * 金币模块
 * - 金币总额
 * - 金币修改
 *      - 添加金币
 *      - 减少金币
 *
 * @export
 * @class Bank
 */
export class Bank {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'Bank');

  public static instance: Bank;

  public static create(): Bank {
    if (!Bank.instance) {
      Bank.instance = new Bank();
    }
    return Bank.instance;
  }

  public readonly id = 'Bank';

  public gold: number = 0;

  public get archive(): ArchiveInterface.ArchiveBank {
    return {
      gold: this.gold,
    };
  }

  constructor() {
    makeAutoObservable(this);

    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
    events.on(EventKeys.Bank.ReceiveGold, this.receiveGold);
  }

  private onLoadArchive = (values: ArchiveInterface.ArchiveValues) => {
    if (values.bank === undefined) {
      Bank.logger.info('Archive bank value was undefined clear gold');
      this.clearGold();
    } else {
      Bank.logger.info('Load archive bank values', values.bank);
      this.setGold(values.bank.gold);
    }
  };

  public receiveGold = (value: number) => {
    this.gold += value;
    Bank.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);

    events.emit(EventKeys.Update.BankUpdate, this);
    prompt.promptGold(value);
  };

  public setGold = (value: number) => {
    this.gold = value;
  };

  public clearGold = () => {
    this.gold = 0;
  };
}

export const bank = Bank.create();
