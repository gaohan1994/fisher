import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { prefixLogger, prefixes } from '@FisherLogger';
import { PersonEquipment } from './PersonEquipment';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { backpack } from '../fisher-backpack';

export interface IPersonUseEquipment {
  (equipmentSlot: EquipmentSlot, equipment: EquipmentItem): void;
}

export interface IPersonRemoveEquipment {
  (equipmentSlot: EquipmentSlot): void;
}

/**
 * 人物装备管理模块
 *
 * @export
 * @class PersonEquipmentManager
 */
export class PersonEquipmentManager {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'FPEquipmentManager');

  public equipmentMap: Map<EquipmentSlot, PersonEquipment> = new Map();

  constructor() {
    makeAutoObservable(this);

    // 初始化武器
    this.equipmentMap.set(
      EquipmentSlot.Weapon,
      new PersonEquipment({ slot: EquipmentSlot.Weapon })
    );
    // 初始化头盔
    this.equipmentMap.set(
      EquipmentSlot.Helmet,
      new PersonEquipment({ slot: EquipmentSlot.Helmet })
    );
  }

  public get equipments() {
    return [...this.equipmentMap.values()];
  }

  /**
   * 使用装备
   * 如果之前该部位装备并不是空的
   * 则把淘汰下来的装备重新放入背包中
   * @type {IPersonUseEquipment}
   * @memberof PersonEquipment
   */
  public useEquipment: IPersonUseEquipment = (equipmentSlot, equipment) => {
    invariant(
      equipment.slots.includes(equipmentSlot),
      'Fail to use equipment, can not match slot'
    );

    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);
    invariant(
      currentSlotEquipment !== undefined,
      'Fail to use equipment, can not find current slot: ' + equipmentSlot
    );
    const prevCurrentSlotEquipmentIsEmpty = currentSlotEquipment.isEmpty;
    const { prevEquipment, prevQuantity } =
      currentSlotEquipment.updateEquipment(equipment, 1);
    this.equipmentMap.set(equipmentSlot, currentSlotEquipment);

    if (!prevCurrentSlotEquipmentIsEmpty) {
      this.putEquipmentToBackpack(prevEquipment, prevQuantity);
    }
    PersonEquipmentManager.logger.debug(
      `use equipment, slot: ${equipmentSlot} equipmentId ${equipment.id}`
    );
  };

  /**
   * 卸下装备
   * 如果之前该部位装备并不是空的
   * 则把卸下来的装备重新放入背包中
   * @param {*} equipmentSlot
   * @type {IPersonRemoveEquipment}
   * @memberof PersonEquipmentManager
   */
  public removeEquipment: IPersonRemoveEquipment = (equipmentSlot) => {
    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);
    invariant(
      currentSlotEquipment !== undefined,
      'Fail to remove equipment, can not find current slot: ' + equipmentSlot
    );
    const prevCurrentSlotEquipmentIsEmpty = currentSlotEquipment.isEmpty;
    const { prevEquipment, prevQuantity } =
      currentSlotEquipment.removeEquipment();
    this.equipmentMap.set(equipmentSlot, currentSlotEquipment);

    if (!prevCurrentSlotEquipmentIsEmpty) {
      this.putEquipmentToBackpack(prevEquipment, prevQuantity);
    }
    PersonEquipmentManager.logger.debug(
      `remove equipment, slot: ${equipmentSlot} equipmentId ${prevEquipment.id}`
    );
  };

  private putEquipmentToBackpack = (
    equipment: EquipmentItem,
    quantity: number
  ) => {
    backpack.addItem(equipment, quantity);
  };
}
