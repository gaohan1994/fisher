import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { prompt } from '../fisher-prompt';
import { EventKeys, events } from '../fisher-events';

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

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Bank.ReceiveGold, this.receiveGold);
  }

  public initialize = async () => {};

  public receiveGold = (value: number) => {
    this.gold += value;
    Bank.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);
    prompt.promptGold(value);
  };

  public clearGold = () => {
    this.gold = 0;
  };
}

export const bank = Bank.create();
