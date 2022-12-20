import { IFisherPersonAttributesAffectedKeys } from '@FisherCore';
import { FisherItem, FisherItemType, IFisherItem } from './FisherItem';

export interface IFisherEquipmentItem extends IFisherItem {
  slots: FisherEquipmentSlot[];
  requirements?: IEquipmentRequirement[];
  attributes?: IEquipmentAttribute[];
}

/**
 * 装备需求
 *
 * @interface IEquipmentRequirement
 */
interface IEquipmentRequirement {}

/**
 * 装备属性
 *
 * @interface IEquipmentAttribute
 */
interface IEquipmentAttribute {
  key: IFisherPersonAttributesAffectedKeys;
  value: number;
}

/**
 * 可装备槽位
 *
 * @export
 * @enum {number}
 */
export enum FisherEquipmentSlot {
  Weapon = 'Weapon',
  Helmet = 'Helmet',
}

/**
 * 装备物品
 *
 * @export
 * @class FisherEquipmentItem
 * @extends {FisherItem}
 */
export class FisherEquipmentItem extends FisherItem {
  type = FisherItemType.Equipment;
  public requirements: IEquipmentRequirement[];
  public slots: FisherEquipmentSlot[];
  public attributes: IEquipmentAttribute[];

  constructor(options: IFisherEquipmentItem) {
    super(options);
    this.slots = options.slots;
    this.requirements = options.requirements ?? [];
    this.attributes = options.attributes ?? [];
  }
}
