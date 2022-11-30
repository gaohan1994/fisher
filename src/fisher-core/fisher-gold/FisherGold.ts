import { makeAutoObservable } from 'mobx';

interface IFisherGold {
  gold?: number;
}

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
export class FisherGold {
  public gold: number;

  constructor({ gold }: IFisherGold) {
    makeAutoObservable(this);
    this.gold = gold ?? 0;
  }

  /**
   * 处理收到的金币
   *
   * @param {number} value
   * @memberof FisherGold
   */
  public receiveGold = (value: number) => {
    this.gold += value;
    return this;
  };
}
