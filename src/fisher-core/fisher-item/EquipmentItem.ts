import { IBonusEquipmentsAttributesKeys } from '@FisherCore';
import { FisherItem, ItemType, IFisherItem } from './FisherItem';

export interface IEquipmentItem extends IFisherItem {
  slots: EquipmentSlot[];
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
  key: IBonusEquipmentsAttributesKeys;
  value: number;
}

/**
 * 可装备槽位
 *
 * @export
 * @enum {number}
 */
export enum EquipmentSlot {
  Weapon = 'Weapon',
  Helmet = 'Helmet',
}

/**
 * 装备物品
 *
 * @export
 * @class EquipmentItem
 * @extends {FisherItem}
 */
export class EquipmentItem extends FisherItem {
  type = ItemType.Equipment;

  public requirements: IEquipmentRequirement[];

  public slots: EquipmentSlot[];

  public attributes: IEquipmentAttribute[];

  public rarity = '';

  constructor(options: IEquipmentItem) {
    super(options);
    this.slots = options.slots;
    this.requirements = options.requirements ?? [];
    this.attributes = options.attributes ?? [];
  }
}
