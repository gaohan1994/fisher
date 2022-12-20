import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import {
  FisherEquipmentItem,
  FisherEquipmentSlot,
  IFisherPersonAttributesAffected,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import { FisherPersonEquipment } from './FisherPersonEquipment';

const logger = prefixLogger(
  prefixes.FISHER_CORE,
  'FisherPersonEquipmentManager'
);

export interface IFisherPersonUseEquipment {
  (equipmentSlot: FisherEquipmentSlot, equipment: FisherEquipmentItem): void;
}

export interface IFisherPersonRemoveEquipment {
  (equipmentSlot: FisherEquipmentSlot): void;
}

/**
 * 人物装备管理模块
 *
 * @export
 * @class FisherPersonEquipmentManager
 */
export class FisherPersonEquipmentManager {
  public equipmentMap: Map<FisherEquipmentSlot, FisherPersonEquipment> =
    new Map();

  constructor() {
    makeAutoObservable(this);

    // 初始化武器
    this.equipmentMap.set(
      FisherEquipmentSlot.Weapon,
      new FisherPersonEquipment({ slot: FisherEquipmentSlot.Weapon })
    );
    // 初始化头盔
    this.equipmentMap.set(
      FisherEquipmentSlot.Helmet,
      new FisherPersonEquipment({ slot: FisherEquipmentSlot.Helmet })
    );
  }

  /**
   * 返回所有装备的属性加成
   *
   * @readonly
   * @type {IFisherPersonAttributesAffected}
   * @memberof FisherPersonEquipmentManager
   */
  public get equipmentAttributes(): IFisherPersonAttributesAffected {
    const result: IFisherPersonAttributesAffected = {
      MaxHp: 0,
      AttackPower: 0,
    };
    this.equipmentMap.forEach(({ equipment }) => {
      const { attributes } = equipment;
      attributes.length > 0 &&
        attributes.forEach(({ key, value }) => {
          result[key] += value;
        });
    });
    return result;
  }

  /**
   * 使用装备
   * 如果之前该部位装备并不是空的
   * 则把淘汰下来的装备重新放入背包中
   * @type {IFisherPersonUseEquipment}
   * @memberof FisherPersonEquipment
   */
  public useEquipment: IFisherPersonUseEquipment = (
    equipmentSlot,
    equipment
  ) => {
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
    logger.info(
      `use equipment, slot: ${equipmentSlot} equipmentId ${equipment.id}`
    );
  };

  /**
   * 卸下装备
   * 如果之前该部位装备并不是空的
   * 则把卸下来的装备重新放入背包中
   * @param {*} equipmentSlot
   * @type {IFisherPersonRemoveEquipment}
   * @memberof FisherPersonEquipmentManager
   */
  public removeEquipment: IFisherPersonRemoveEquipment = (equipmentSlot) => {
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
    logger.info(
      `remove equipment, slot: ${equipmentSlot} equipmentId ${prevEquipment.id}`
    );
  };

  private putEquipmentToBackpack = (
    equipment: FisherEquipmentItem,
    quantity: number
  ) => {
    fisher.fisherBackpack.addItem(equipment, quantity);
  };
}
