import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { FisherItem } from '@FisherCore';
import { FisherBackpackItem } from './FisherBackpackItem';
import { calculateItemPrice } from './Utils';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherBackpack');

/**
 * 添加物品到背包
 *
 * @interface IFisherBackpackAddItem
 */
interface IFisherBackpackAddItem {
  (item: FisherItem, quantity: number): void;
}

/**
 * 添加 itemId 的物品到背包
 *
 * @interface IFisherBackpackAddItemById
 */
interface IFisherBackpackAddItemById {
  (itemId: string, quantity: number): void;
}

/**
 * 添加/删除选中的物品
 *
 * @interface IFisherBackpackToggleSelectItem
 */
interface IFisherBackpackToggleSelectItem {
  (item: FisherBackpackItem): void;
}

/**
 * 卖出物品
 *
 * @interface IFisherBackpackSellItem
 */
interface IFisherBackpackSellItem {
  (items: FisherBackpackItem, quantity?: number): void;
}

/**
 * 卖出物品
 *
 * @interface IFisherBackpackSellItems
 */
interface IFisherBackpackSellItems {
  (items: FisherBackpackItem[]): void;
}

/**
 * 卖出全部选中的物品
 *
 * @interface IFisherBackpackSellSelectedItems
 */
interface IFisherBackpackSellSelectedItems {
  (): void;
}

/**
 * 减少 quantity 个传入物品
 *
 * @interface IFisherBackpackReduceItem
 */
interface IFisherBackpackReduceItem {
  (item: FisherItem, quantity: number): void;
}

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
  public items = new Map<FisherItem, FisherBackpackItem>();
  public selectedItems = new Set<FisherBackpackItem>();

  constructor() {
    makeAutoObservable(this);
    logger.info('FisherBackpack constructor');
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
   *
   * @param {*} item
   * @param {*} quantity
   * @type {IFisherBackpackAddItem}
   * @memberof FisherBackpack
   */
  public addItem: IFisherBackpackAddItem = (item, quantity) => {
    invariant(
      quantity > 0,
      'Fail to add item to backpack, quantity should > 0'
    );
    let success = false;
    if (this.items.has(item)) {
      // 如果背包中存在物品则添加相应数量
      const currentFisherBackpackItem = this.items.get(item);
      if (currentFisherBackpackItem !== undefined) {
        currentFisherBackpackItem.quantity += quantity;
        this.items.set(item, currentFisherBackpackItem);
        success = true;
        logger.info(
          `Success update ${item.name} x ${quantity} to backpack, `,
          `current quantity: ${currentFisherBackpackItem.quantity + quantity}`
        );
      }
    } else {
      // 如果背包中不存在该物品则新建物品类并保存
      const fisherBackpackItem = new FisherBackpackItem({ item, quantity });
      this.items.set(item, fisherBackpackItem);
      logger.info(
        `Success add new item: ${item.name} x ${quantity} to backpack`
      );
      success = true;
    }

    if (success) {
      return 'success';
    }
    logger.info(`Fail add ${item.name} x ${quantity} to backpack`);
    return 'fail';
  };

  public addItemById: IFisherBackpackAddItemById = (itemId, quantity) => {};

  /**
   * 减少 quantity 个传入物品
   *
   * @param {*} item
   * @param {*} quantity
   * @type {IFisherBackpackReduceItem}
   * @memberof FisherBackpack
   */
  public reduceItem: IFisherBackpackReduceItem = (item, quantity) => {
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
      logger.info(`Delete backpack ${item.name}, quantity <= 0`);
    } else {
      this.items.set(item, backpackItem);
      logger.info(
        `Success reduce ${item.name} x ${quantity} to backpack, `,
        `current quantity: ${backpackItem.quantity}`
      );
    }
  };

  /**
   * 添加/删除选中的物品
   *
   * @param {*} item
   * @type {IFisherBackpackToggleSelectItem}
   * @memberof FisherBackpack
   */
  public toggleSelectItem: IFisherBackpackToggleSelectItem = (item) => {
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
   *
   * @param {*} item
   * @param {*} quantity
   * @type {IFisherBackpackSellItem}
   * @memberof FisherBackpack
   */
  public sellItem: IFisherBackpackSellItem = (item, quantity) => {
    // 找到要卖出的物品
    const sellItem = this.items.get(item.item);
    if (!sellItem) return;
    // 计算卖出的价格,如果没有传入数量则全部卖出
    const sellQuantity = quantity ?? sellItem.quantity;
    const totalPrice = calculateItemPrice(item, sellQuantity);
    fisher.fisherGold.receiveGold(totalPrice);
    this.reduceItem(item.item, sellQuantity);
    logger.info(
      `Success sell ${item.item.name} x ${quantity}, `,
      `price: ${item.item.price}, totalPrice: ${totalPrice}`
    );
  };

  /**
   * 卖出多个物品不用传入数量默认全部卖出
   *
   * @param {*} items
   * @type {IFisherBackpackSellItems}
   * @memberof FisherBackpack
   */
  public sellItems: IFisherBackpackSellItems = (items) => {
    items.forEach((item) => {
      this.sellItem(item);
    });
  };

  /**
   * 卖出全部选中的物品
   * 卖完之后清空选中物品列表
   *
   * @type {IFisherBackpackSellSelectedItems}
   * @memberof FisherBackpack
   */
  public sellSelectedItems: IFisherBackpackSellSelectedItems = () => {
    invariant(
      this.selectedItems.size > 0,
      'Fail to sell selected items, selected items were empty'
    );
    this.selectedItems.forEach((item) => {
      this.sellItem(item);
    });
    this.selectedItems.clear();
  };
}
