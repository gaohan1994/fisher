import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { EmptyEquipment } from '../fisher-packages';

interface IPersonEquipment {
  slot: EquipmentSlot;
  equipment?: EquipmentItem;
  quantity?: number;
}

/**
 * 更新装备
 *
 * @interface IEquipmentUpdate
 */
interface IEquipmentUpdate {
  (value: EquipmentItem, quantity: number): {
    prevEquipment: EquipmentItem;
    prevQuantity: number;
  };
}

/**
 * 卸下装备
 *
 * @interface IEquipmentRemove
 */
interface IEquipmentRemove {
  (): {
    prevEquipment: EquipmentItem;
    prevQuantity: number;
  };
}

/**
 * 人物装备
 *
 * @export
 * @class PersonEquipment
 */
export class PersonEquipment {
  /**
   * 没有佩戴装备时显示的空装备信息
   */
  public emptyEquipment: EquipmentItem;

  /**
   * 装备
   */
  public equipment: EquipmentItem;

  /**
   * 装备数量
   */
  public quantity: number;

  public slot: EquipmentSlot;

  constructor({ slot, equipment, quantity }: IPersonEquipment) {
    makeAutoObservable(this);
    this.emptyEquipment = EmptyEquipment;
    this.equipment = equipment ?? EmptyEquipment;
    this.quantity = quantity ?? 0;
    this.slot = slot;
  }

  /**
   * 当前装备是否为空
   */
  public get isEmpty(): boolean {
    return this.equipment.id === this.emptyEquipment.id;
  }

  /**
   * 更新装备
   * - 如果当前装备不为空则返回旧装备
   * - 如果当前装备为空则直接覆盖
   */
  public updateEquipment: IEquipmentUpdate = (value, quantity = 1) => {
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
   * @type {IEquipmentRemove}
   * @memberof EquipmentSlot
   */
  public removeEquipment: IEquipmentRemove = () => {
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
