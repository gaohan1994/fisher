import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import {
  EmptyEquipment,
  FisherEquipmentItem,
  FisherEquipmentSlot,
} from '@FisherCore';

interface IFisherEquipment {
  slot: FisherEquipmentSlot;
  equipment?: FisherEquipmentItem;
  quantity?: number;
}

/**
 * 更新装备
 *
 * @interface IFisherEquipmentUpdate
 */
interface IFisherEquipmentUpdate {
  (value: FisherEquipmentItem, quantity: number): {
    prevEquipment: FisherEquipmentItem;
    prevQuantity: number;
  };
}

/**
 * 卸下装备
 *
 * @interface IFisherEquipmentRemove
 */
interface IFisherEquipmentRemove {
  (): {
    prevEquipment: FisherEquipmentItem;
    prevQuantity: number;
  };
}

/**
 * 人物装备
 *
 * @export
 * @class FisherPersonEquipment
 */
export class FisherPersonEquipment {
  /**
   * 没有佩戴装备时显示的空装备信息
   *
   * @type {FisherEquipmentItem}
   * @memberof FisherEquipment
   */
  public emptyEquipment: FisherEquipmentItem;

  /**
   * 装备
   *
   * @type {FisherEquipmentItem}
   * @memberof FisherEquipment
   */
  public equipment: FisherEquipmentItem;

  /**
   * 装备数量
   *
   * @type {number}
   * @memberof FisherEquipment
   */
  public quantity: number;

  public slot: FisherEquipmentSlot;

  constructor({ slot, equipment, quantity }: IFisherEquipment) {
    makeAutoObservable(this);
    this.emptyEquipment = EmptyEquipment;
    this.equipment = equipment ?? EmptyEquipment;
    this.quantity = quantity ?? 0;
    this.slot = slot;
  }

  /**
   * 当前装备是否为空
   *
   * @readonly
   * @type {boolean}
   * @memberof FisherEquipment
   */
  public get isEmpty(): boolean {
    return this.equipment.id === this.emptyEquipment.id;
  }

  /**
   * 更新装备
   * - 如果当前装备不为空则返回旧装备
   * - 如果当前装备为空则直接覆盖
   *
   * @param {FisherEquipmentItem} value
   * @memberof FisherEquipment
   */
  public updateEquipment: IFisherEquipmentUpdate = (value, quantity = 1) => {
    const prevEquipment = this.equipment;
    const prevQuantity = this.quantity;
    this.equipment = value;
    this.quantity = quantity;
    return { prevEquipment, prevQuantity };
  };

  /**
   * 卸下装备
   * - 如果当前槽位装备为空则报错
   * - 如果当前槽位有装备则设置为空装备并返回旧装备
   *
   * @type {IFisherEquipmentRemove}
   * @memberof FisherEquipmentSlot
   */
  public removeEquipment: IFisherEquipmentRemove = () => {
    invariant(
      this.isEmpty !== true,
      'Fail to remove equipment, current slot equipment was empty'
    );
    const prevEquipment = this.equipment;
    const prevQuantity = this.quantity;
    this.equipment = this.emptyEquipment;
    this.quantity = 0;
    return { prevEquipment, prevQuantity };
  };

  public updateQuantity = (value: number) => {
    this.quantity += value;
  };

  public setQuantity = (value: number) => {
    this.quantity = value;
  };
}
