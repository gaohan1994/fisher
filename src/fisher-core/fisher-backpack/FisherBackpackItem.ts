import { makeAutoObservable } from 'mobx';
import { Item } from '@FisherCore';

interface IFisherBackpackItem {
  item: Item;
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
   * @type {Item}
   * @memberof FisherBackpackItem
   */
  public item: Item;

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
