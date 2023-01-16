import { IBonusEquipmentsAttributesKeys } from '@FisherCore';
import { Item, ItemType, IItem } from './Item';

export interface IEquipmentItem extends IItem {
  slots: Array<EquipmentSlot[number]>;
  requirements?: IEquipmentRequirement[];
  attributes?: IEquipmentAttribute[];
  equipmentSetId?: string;
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
export interface IEquipmentAttribute {
  key: IBonusEquipmentsAttributesKeys[number];
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
export class EquipmentItem extends Item {
  type = ItemType.Equipment;

  public slots: EquipmentSlot[];

  public requirements: IEquipmentRequirement[] = [];

  public attributes: IEquipmentAttribute[] = [];

  public get hasAttributes() {
    return this.attributes.length > 0;
  }

  public rarity = '';

  public equipmentSetId?: string | undefined = undefined;

  public get hasEquipmentSet() {
    return this.equipmentSetId !== undefined;
  }

  constructor(options: IEquipmentItem) {
    super(options);
    this.slots = options.slots as EquipmentSlot[];

    if (options.requirements) this.requirements = options.requirements;
    if (options.attributes) this.attributes = options.attributes;
    if (options.equipmentSetId) this.equipmentSetId = options.equipmentSetId;
  }
}
