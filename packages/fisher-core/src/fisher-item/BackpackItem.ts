import { makeAutoObservable } from 'mobx';
import { Item } from './Item.js';

/**
 * 背包物品类
 *
 * @export
 * @class BackpackItem
 */
export class BackpackItem<T = Item> {
  /**
   * 物品基本信息
   *
   * @type {Item}
   * @memberof BackpackItem
   */
  public item: T;

  /**
   * 物品数量
   *
   * @type {number}
   * @memberof BackpackItem
   */
  public quantity: number;

  constructor(item: T, quantity: number) {
    makeAutoObservable(this);

    this.item = item;
    this.quantity = quantity;
  }

  /**
   * 计算价格
   *
   * @param {number} quantity
   * @memberof BackpackItem
   */
  public calculatePrice = (quantity: number) => {
    const totalPrice = (this.item as Item).price * quantity;
    return Math.max(Math.floor(totalPrice), 0);
  };
}
