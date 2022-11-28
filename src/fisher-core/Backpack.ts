import { makeAutoObservable } from 'mobx';
import { Equip } from './Equip';

/**
 * 基础物品类型
 *
 * @interface BackpackItemBase
 */
interface BackpackItemBase {
  id: number;
  desc: string;
  label: string;
  count: number;
}

/**
 * 推断背包物品的类型
 * 如果背包物品命中预设类型则直接使用该类型
 * 否则返回基础物品类型
 */
type BackpackItem<T = BackpackItemBase> = T extends Equip
  ? T
  : BackpackItemBase;

export class Backpack {
  public items = new Map<number, BackpackItem>();
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 获取背包中的所有物品
   *
   * @readonly
   * @memberof Backpack
   */
  public get displayItems() {
    const displayItems: BackpackItem[] = [];
    this.items.forEach((item) => displayItems.push(item));
    return displayItems;
  }

  /**
   * 收到物品并存入背包
   *
   * @param {BackpackItem} item
   * @memberof Backpack
   */
  public receiveItem = (item: BackpackItem) => {
    this.items.set(item.id, item);
    return this;
  };

  /**
   * 删除物品
   *
   * @param {BackpackItem} item
   * @memberof Backpack
   */
  public deleteItem = (item: BackpackItem) => {
    return this.items.delete(item.id);
  };

  /**
   * 根据id删除物品
   *
   * @param {number} id
   * @memberof Backpack
   */
  public deleteItemById = (id: number) => {
    return this.items.delete(id);
  };

  /**
   * 对背包物品进行操作
   *
   * @param {BackpackItem} item
   * @param {number} [count=1]
   * @memberof Backpack
   */
  public updateItem = (item: BackpackItem, count: number = 1) => {
    /**
     * 校验当前物品的数量加上更新的数量之后是否为0
     *
     * @param {number} currentCount
     * @param {number} updateCount
     * @return {*}
     */
    const checkAfterUpdateItemCountIsZero = (
      currentCount: number,
      updateCount: number
    ) => {
      return currentCount + updateCount === 0;
    };

    if (this.items.has(item.id)) {
      const currentItem = this.items.get(item.id);
      // typescript check
      if (!currentItem) return;

      // 如果当前物品的数量加上更新的数量等于0则删除该物品
      if (checkAfterUpdateItemCountIsZero(currentItem.count, count)) {
        return this.items.delete(item.id);
      }

      // 否则更新物品数量
      this.items.set(item.id, {
        ...currentItem,
        count: currentItem.count + count,
      });
    }

    // 如果背包中没有传入物品则保存
    this.items.set(item.id, {
      ...item,
      count: item.count + count,
    });
  };
}
