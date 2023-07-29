import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@fisher/logger';
import { Assets } from '@assets';
import { store } from '../fisher-packages/index.js';
import { ArchiveInterface } from '@archive';
import { BackpackItem, Item, ItemType } from '@item';
import { Information, informationAlert } from '@information';
import { ComponentId, EventKeys, events, FisherBackpackError } from '@shared';

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
class Backpack {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, ComponentId.Backpack);

  public static instance: Backpack;

  public static create(): Backpack {
    if (!Backpack.instance) {
      Backpack.instance = new Backpack();
    }
    return Backpack.instance;
  }

  public readonly id = ComponentId.Backpack;

  public name = '背包';

  public media = Assets.backpack;

  public items = new Map<Item, BackpackItem>();

  public get backpackItems() {
    return [...this.items.values()];
  }

  public get archive(): ArchiveInterface.ArchiveBackpack {
    return this.backpackItems.map(({ item, quantity }) => ({ id: item.id, quantity }));
  }

  public selectedItems = new Set<BackpackItem>();

  public get selectedItemsPriceAmount() {
    let result = 0;

    this.selectedItems.forEach((item) => {
      result += item.calculatePrice(item.quantity);
    });

    return result;
  }

  constructor() {
    makeAutoObservable(this);

    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);

    // after update backpack item
    // emit BackpackUpdated event
    // need post lastest backpack to the other components
    events.on(EventKeys.Backpack.AddItem, this.addItem);
    events.on(EventKeys.Backpack.ReduceItem, this.reduceItem);
    events.on(EventKeys.Backpack.SellItem, this.sellItem);
  }

  private onLoadArchive = (values: ArchiveInterface.ArchiveValues) => {
    // clear backpack first
    this.items.clear();
    this.selectedItems.clear();

    if (values.backpack !== undefined) {
      const { backpack: archiveBackpackValues } = values;

      for (let index = 0; index < archiveBackpackValues.length; index++) {
        const { id, quantity } = archiveBackpackValues[index];
        this.addItemById(id, quantity);
      }

      Backpack.logger.info('Load archive backpack values');
    }
  };

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

  public getItem = <T extends Item>(item: T): BackpackItem | undefined => {
    if (!this.checkItem(item)) {
      throw new FisherBackpackError(`Try to get item ${item.id} but doesn't exsit in backpack`);
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

  public getItemsByType = <T>(itemType: ItemType): BackpackItem<T>[] => {
    let result: BackpackItem[] = [];

    this.items.forEach((backpackItem, item) => {
      if (item.type === itemType) {
        result.push(backpackItem);
      }
    });

    return result as BackpackItem<T>[];
  };

  public addItem = (item: Item, quantity: number, shouldAlertInformation = false) => {
    if (quantity <= 0) {
      throw new FisherBackpackError(`Fail to add ${item.id} to backpack, quantity should > 0`, '数量不正确');
    }

    if (this.items.has(item)) {
      this.addExistingItem(item, quantity);
    } else {
      this.addNewItem(item, quantity);
    }

    const message = new Information.ItemMessage(item, quantity);
    events.emit(EventKeys.Information.Messages, [message], shouldAlertInformation);
    events.emit(EventKeys.Update.BackpackUpdate, this);
  };

  public addItemById = (itemId: string, quantity: number) => {
    const item = store.findItemById(itemId);
    if (item === undefined) {
      return Backpack.logger.error(`Try to add item ${itemId} but can not found this item`);
    }

    this.addItem(item, quantity);
  };

  private addNewItem = (item: Item, quantity: number) => {
    const backpackItem = new BackpackItem(item, quantity);
    this.items.set(item, backpackItem);
  };

  private addExistingItem = (item: Item, quantity: number) => {
    const backpackItem = this.items.get(item)!;
    backpackItem.quantity += quantity;
    this.items.set(item, backpackItem);
  };

  public reduceItem = (item: Item, quantity: number, shouldAlertInformation = false) => {
    const backpackItem = this.items.get(item);
    const reduceQuantity = Math.abs(quantity);

    if (backpackItem === undefined) {
      return Backpack.logger.error(`Fail to reduce item can not find backpack item ${item.id}`);
    }

    if (reduceQuantity === 0) {
      return Backpack.logger.error(`Try to reduce item with quantity 0`);
    }

    backpackItem.quantity -= reduceQuantity;
    if (backpackItem.quantity <= 0) {
      this.items.delete(item);
    } else {
      this.items.set(item, backpackItem);
    }

    const message = new Information.ItemMessage(item, -reduceQuantity);
    events.emit(EventKeys.Information.Messages, [message], shouldAlertInformation);
    events.emit(EventKeys.Update.BackpackUpdate, this);
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

  public addSelectItem = (item: BackpackItem) => {
    this.selectedItems.add(item);
  };

  public resetSelectItems = () => {
    this.selectedItems.clear();
  };

  /**
   * if pass quantity use passed quantity
   * if not pass quantity default sell all item quantity
   */
  public sellItem = (item: BackpackItem, quantity?: number) => {
    const sellItem = this.items.get(item.item);

    if (sellItem === undefined) {
      throw new FisherBackpackError(
        `Try to sell item ${item.item.id} but current backpack does not have item`,
        '没有找到要出售的物品'
      );
    }

    const _quantity = Math.min(quantity ?? sellItem.quantity, sellItem.quantity);
    const sellPrice = item.calculatePrice(_quantity);

    this.reduceItem(item.item, _quantity);

    events.emit(EventKeys.Bank.ReceiveGold, sellPrice, true);
    events.emit(EventKeys.Update.BackpackUpdate, this);
    Backpack.logger.debug(`sell item ${item.item.name} x ${quantity} sell price: ${sellPrice}`);

    return this;
  };

  public sellSelectedItems = () => {
    if (this.selectedItems.size <= 0) {
      throw new FisherBackpackError(
        'Fail to sell selected items, selected items are empty',
        '出售失败，没有要出售的物品'
      );
    }

    informationAlert([
      new Information.NormalMessage(`您共卖出了${this.selectedItems.size}种物品`, Information.InformationColor.Orange),
    ]);

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

export { Backpack };
