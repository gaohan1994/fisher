import { makeAutoObservable } from 'mobx';
import { Item } from '@FisherCore';

interface IBackpackItem {
  item: Item;
  quantity: number;
}

/**
 * 背包物品类
 *
 * @export
 * @class BackpackItem
 */
export class BackpackItem {
  /**
   * 物品基本信息
   *
   * @type {Item}
   * @memberof BackpackItem
   */
  public item: Item;

  /**
   * 物品数量
   *
   * @type {number}
   * @memberof BackpackItem
   */
  public quantity: number;

  constructor({ item, quantity }: IBackpackItem) {
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
    const totalPrice = this.item.price * quantity;
    return Math.max(Math.floor(totalPrice), 0);
  };
}
