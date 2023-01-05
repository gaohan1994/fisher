import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { prompt } from '../fisher-prompt';

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
// @RegisterModule(ModuleKey.Gold)
export class Bank {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'Bank');

  public static instance: Bank;

  public static create(): Bank {
    if (!Bank.instance) {
      Bank.instance = new Bank();
    }
    return Bank.instance;
  }

  public gold: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  public initialize = async () => {};

  /**
   * 处理收到的金币
   *
   * @param {number} value
   * @memberof Bank
   */
  public receiveGold = (value: number) => {
    this.gold += value;
    Bank.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);
    prompt.promptGold(value);
  };
}

export const bank = Bank.create();
