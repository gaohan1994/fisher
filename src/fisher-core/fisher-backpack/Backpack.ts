import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { prompt } from '../fisher-prompt';
import { BackpackItem, Item } from '../fisher-item';
import { EventKeys, events } from '../fisher-events';

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

  public readonly id = 'Backpack';

  public static instance: Backpack;

  public static create(): Backpack {
    if (!Backpack.instance) {
      Backpack.instance = new Backpack();
    }
    return Backpack.instance;
  }

  public items = new Map<Item, BackpackItem>();

  public get backpackItems() {
    return [...this.items.values()];
  }

  public selectedItems = new Set<BackpackItem>();

  constructor() {
    makeAutoObservable(this);

    // after update backpack item
    // emit BackpackUpdated event
    // need post lastest backpack to the other components
    events.on(EventKeys.Backpack.AddItem, this.addItem);
    events.on(EventKeys.Backpack.ReduceItem, this.reduceItem);
    events.on(EventKeys.Backpack.SellItem, this.sellItem);
  }

  public initialize = async () => {};

  public checkItem = (item: Item, quantity = 1) => {
    const backpackItem = this.items.get(item);
    if (!backpackItem) {
      return false;
    } else {
      return backpackItem.quantity >= quantity;
    }
  };

  public checkItemById = (itemId: string, quantity = 1): boolean => {
    const item: Item | undefined = this.getItemMapKeyById(itemId);

    if (item === undefined) {
      return false;
    }
    return this.checkItem(item, quantity);
  };

  public getItem = (item: Item): BackpackItem | undefined => {
    if (!this.checkItem(item)) {
      return Backpack.logger.error(`Try to get item ${item.id} but doesn't exsit in backpack`);
    }

    return this.items.get(item);
  };

  public getItemById = (itemId: string): BackpackItem | undefined => {
    const item: Item | undefined = this.getItemMapKeyById(itemId);

    if (item === undefined) {
      return undefined;
    }
    return this.getItem(item);
  };

  public addItem = (item: Item, quantity: number) => {
    invariant(quantity > 0, `Fail to add ${item.id} to backpack, quantity should > 0`);

    if (this.items.has(item)) {
      this.addExistingItem(item, quantity);
    } else {
      this.addNewItem(item, quantity);
    }

    events.emit(EventKeys.Backpack.BackpackUpdated, this);
  };

  private addNewItem = (item: Item, quantity: number) => {
    const backpackItem = new BackpackItem(item, quantity);
    this.items.set(item, backpackItem);

    prompt.promptItem(item, quantity);
  };

  private addExistingItem = (item: Item, quantity: number) => {
    const backpackItem = this.items.get(item)!;
    backpackItem.quantity += quantity;
    this.items.set(item, backpackItem);

    prompt.promptItem(item, quantity);
  };

  public reduceItem = (item: Item, quantity: number) => {
    const backpackItem = this.items.get(item);
    const reduceQuantity = Math.abs(quantity);
    invariant(backpackItem !== undefined && reduceQuantity !== 0, `Fail to reduce ${item.id} x ${reduceQuantity}`);

    backpackItem.quantity -= reduceQuantity;
    if (backpackItem.quantity <= 0) {
      this.items.delete(item);
    } else {
      this.items.set(item, backpackItem);
    }

    events.emit(EventKeys.Backpack.BackpackUpdated, this);
  };

  public reduceItemById = (itemId: string, quantity: number) => {
    const item: Item | undefined = this.getItemMapKeyById(itemId);
    item && this.reduceItem(item, quantity);
  };

  public toggleSelectItem = (item: BackpackItem) => {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  };

  /**
   * if pass quantity use passed quantity
   * if not pass quantity default sell all item quantity
   */
  public sellItem = (item: BackpackItem, quantity?: number) => {
    const sellItem = this.items.get(item.item);
    invariant(sellItem !== undefined, `Try to sell item ${item.item.id} but current backpack does not have item`);

    const _quantity = Math.min(quantity ?? sellItem.quantity, sellItem.quantity);
    const sellPrice = item.calculatePrice(_quantity);

    this.reduceItem(item.item, _quantity);

    events.emit(EventKeys.Bank.ReceiveGold, sellPrice);
    events.emit(EventKeys.Backpack.BackpackUpdated, this);

    Backpack.logger.debug(`sell item ${item.item.name} x ${quantity} sell price: ${sellPrice}`);
  };

  public sellItems = (items: BackpackItem[]) => {
    for (let index = 0; index < items.length; index++) {
      this.sellItem(items[index]);
    }
  };

  public sellSelectedItems = () => {
    invariant(this.selectedItems.size > 0, 'Fail to sell selected items, selected items are empty');

    this.selectedItems.forEach((item) => {
      this.sellItem(item);
    });

    this.selectedItems.clear();
  };

  private getItemMapKeyById = (itemId: string): Item | undefined => {
    let result: Item | undefined = undefined;

    this.items.forEach((_, item) => {
      if (item.id === itemId) {
        result = item;
      }
    });

    return result;
  };
}

export const backpack = Backpack.create();
