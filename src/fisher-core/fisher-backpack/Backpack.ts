import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { Item, BackpackItem, fisherPrompt } from '@FisherCore';
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
export class Backpack {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'Backpack');

  public items = new Map<Item, BackpackItem>();

  public selectedItems = new Set<BackpackItem>();

  constructor() {
    makeAutoObservable(this);
  }

  public get backpackItems() {
    const result: BackpackItem[] = [];
    this.items.forEach((BackpackItem) => {
      result.push(BackpackItem);
    });
    return result;
  }

  /**
   * 添加物品到背包
   */
  public addItem = (item: Item, quantity: number) => {
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
   * @param {Item} item
   * @param {number} quantity
   * @memberof Backpack
   */
  public addNewItem = (item: Item, quantity: number) => {
    const backpackItem = new BackpackItem({ item, quantity });
    this.items.set(item, backpackItem);

    fisherPrompt.promptItem(item, quantity);
  };

  /**
   * 如果背包中存在物品则添加相应数量
   *
   * @param {Item} item
   * @param {number} quantity
   * @memberof Backpack
   */
  public addExistingItem = (item: Item, quantity: number) => {
    const backpackItem = this.items.get(item);
    if (backpackItem === undefined)
      return Backpack.logger.error(
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
  public reduceItem = (item: Item, quantity: number) => {
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
  public toggleSelectItem = (item: BackpackItem) => {
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
  public sellItem = (item: BackpackItem, quantity?: number) => {
    const sellItem = this.items.get(item.item);
    if (!sellItem) return;

    const sellQuantity = quantity ?? sellItem.quantity;
    const totalPrice = item.calculatePrice(sellQuantity);

    fisher.fisherGold.receiveGold(totalPrice);
    this.reduceItem(item.item, sellQuantity);

    Backpack.logger.debug(
      `Success sell ${item.item.name} x ${quantity}, `,
      `price: ${item.item.price}, totalPrice: ${totalPrice}`
    );
  };

  /**
   * 卖出多个物品不用传入数量默认全部卖出
   */
  public sellItems = (items: BackpackItem[]) => {
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
      return Backpack.logger.error(
        'Fail to sell selected items, selected items were empty'
      );
    }
    this.selectedItems.forEach((item) => {
      this.sellItem(item);
    });
    this.selectedItems.clear();
  };
}
