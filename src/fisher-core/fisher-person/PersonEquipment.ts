import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { EmptyEquipment } from '../fisher-packages';

interface IPersonEquipment {
  slot: EquipmentSlot;
  equipment?: EquipmentItem;
  quantity?: number;
}

type IEquipmentUpdateReturned = [EquipmentItem, number];

/**
 * 人物装备
 *
 * @export
 * @class PersonEquipment
 */
export class PersonEquipment {
  public emptyEquipment: EquipmentItem;

  public equipment: EquipmentItem;

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
  public updateEquipment = (value: EquipmentItem, quantity: number): IEquipmentUpdateReturned | undefined => {
    let result: IEquipmentUpdateReturned | undefined = undefined;
    if (!this.isEmpty) {
      result = [this.equipment, this.quantity];
    }

    this.equipment = value;
    this.quantity = quantity;

    return result;
  };

  /**
   * 卸下装备
   * - 如果当前槽位装备为空则报错
   * - 如果当前槽位有装备则设置为空装备并返回旧装备
   *
   * @type {IEquipmentRemove}
   * @memberof EquipmentSlot
   */
  public removeEquipment = (): IEquipmentUpdateReturned => {
    invariant(this.isEmpty !== true, 'Fail to remove equipment, current slot equipment was empty');
    const result: IEquipmentUpdateReturned = [this.equipment, this.quantity];

    this.equipment = this.emptyEquipment;
    this.quantity = 0;

    return result;
  };

  public updateQuantity = (value: number) => {
    this.quantity += value;
  };

  public setQuantity = (value: number) => {
    this.quantity = value;
  };
}
