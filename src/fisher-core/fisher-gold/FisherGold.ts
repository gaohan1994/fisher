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
 * @class FisherGold
 */
// @RegisterModule(ModuleKey.Gold)
export class FisherGold {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherGold');

  public gold: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 处理收到的金币
   *
   * @param {number} value
   * @memberof FisherGold
   */
  public receiveGold = (value: number) => {
    this.gold += value;
    FisherGold.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);
    prompt.promptGold(value);
  };
}
