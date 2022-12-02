import { makeAutoObservable } from 'mobx';
import { FisherItem } from '@FisherCore';

interface IFisherBackpackItem {
  item: FisherItem;
  quantity: number;
}

/**
 * 背包物品类
 *
 * @export
 * @class FisherBackpackItem
 */
export class FisherBackpackItem {
  /**
   * 物品基本信息
   *
   * @type {FisherItem}
   * @memberof FisherBackpackItem
   */
  public item: FisherItem;

  /**
   * 物品数量
   *
   * @type {number}
   * @memberof FisherBackpackItem
   */
  public quantity: number;
  constructor({ item, quantity }: IFisherBackpackItem) {
    makeAutoObservable(this);
    this.item = item;
    this.quantity = quantity;
  }
}
