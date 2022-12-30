import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { FisherItem, fisherPrompt } from '@FisherCore';
import { FisherBackpackItem } from './FisherBackpackItem';
import { calculateItemPrice } from './Utils';
import { prefixLogger, prefixes } from '@FisherLogger';

/**
 * 背包系统
 * 在游戏初始化的时候同时初始化背包
 * 并且从存档中获取用户背包数据并赋值
 *
 * 背包功能:
 * - 添加物品
 * - 卖出物品
 * - 物品展示
 *
 * @export
 * @class Backpack
 */
export class FisherBackpack {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherBackpack');

  public items = new Map<FisherItem, FisherBackpackItem>();

  public selectedItems = new Set<FisherBackpackItem>();

  constructor() {
    makeAutoObservable(this);
  }

  public get backpackItems() {
    const result: FisherBackpackItem[] = [];
    this.items.forEach((fisherBackpackItem) => {
      result.push(fisherBackpackItem);
    });
    return result;
  }

  /**
   * 添加物品到背包
   */
  public addItem = (item: FisherItem, quantity: number) => {
    invariant(
      quantity > 0,
      'Fail to add item to backpack, quantity should > 0'
    );
    if (this.items.has(item)) {
      this.addExistingItem(item, quantity);
    } else {
      this.addNewItem(item, quantity);
    }
  };

  /**
   * 如果背包中不存在该物品则新建物品类并保存
   *
   * @param {FisherItem} item
   * @param {number} quantity
   * @memberof FisherBackpack
   */
  public addNewItem = (item: FisherItem, quantity: number) => {
    const backpackItem = new FisherBackpackItem({ item, quantity });
    this.items.set(item, backpackItem);

    fisherPrompt.promptItem(item, quantity);
  };

  /**
   * 如果背包中存在物品则添加相应数量
   *
   * @param {FisherItem} item
   * @param {number} quantity
   * @memberof FisherBackpack
   */
  public addExistingItem = (item: FisherItem, quantity: number) => {
    const backpackItem = this.items.get(item);
    if (backpackItem === undefined)
      return FisherBackpack.logger.error(
        'Try to add existing item to backpack but get undefined!',
        item
      );
    backpackItem.quantity += quantity;
    this.items.set(item, backpackItem);

    fisherPrompt.promptItem(item, quantity);
  };

  /**
   * 减少 quantity 个传入物品
   */
  public reduceItem = (item: FisherItem, quantity: number) => {
    invariant(
      quantity > 0,
      'Fail to reduce backpack item, quantity should > 0'
    );

    const backpackItem = this.items.get(item);
    invariant(
      backpackItem !== undefined,
      'Fail to reduce backpackItem quantity, backpackItem undefined'
    );

    backpackItem.quantity -= quantity;
    if (backpackItem.quantity <= 0) {
      this.items.delete(item);
    } else {
      this.items.set(item, backpackItem);
    }
  };

  /**
   * 添加/删除选中的物品
   */
  public toggleSelectItem = (item: FisherBackpackItem) => {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  };

  /**
   * 卖出物品
   * 如果传入的卖出数量则使用传入的卖出数量
   * 如果没有传入卖出数量则全部卖出
   */
  public sellItem = (item: FisherBackpackItem, quantity?: number) => {
    // 找到要卖出的物品
    const sellItem = this.items.get(item.item);
    if (!sellItem) return;
    // 计算卖出的价格,如果没有传入数量则全部卖出
    const sellQuantity = quantity ?? sellItem.quantity;
    const totalPrice = calculateItemPrice(item, sellQuantity);
    fisher.fisherGold.receiveGold(totalPrice);
    this.reduceItem(item.item, sellQuantity);

    FisherBackpack.logger.debug(
      `Success sell ${item.item.name} x ${quantity}, `,
      `price: ${item.item.price}, totalPrice: ${totalPrice}`
    );
  };

  /**
   * 卖出多个物品不用传入数量默认全部卖出
   */
  public sellItems = (items: FisherBackpackItem[]) => {
    items.forEach((item) => {
      this.sellItem(item);
    });
  };

  /**
   * 卖出全部选中的物品
   * 卖完之后清空选中物品列表
   */
  public sellSelectedItems = () => {
    if (this.selectedItems.size <= 0) {
      return FisherBackpack.logger.error(
        'Fail to sell selected items, selected items were empty'
      );
    }
    this.selectedItems.forEach((item) => {
      this.sellItem(item);
    });
    this.selectedItems.clear();
  };
}
