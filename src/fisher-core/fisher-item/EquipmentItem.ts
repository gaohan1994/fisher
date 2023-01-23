import { IBonusEquipmentsAttributesKeys } from '@FisherCore';
import { EquipmentSlot } from './EquipmentConstants';
import { Item, ItemType, IItem } from './Item';

export interface IEquipmentItem extends IItem {
  slot: EquipmentSlot[number];
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

export class EquipmentItem extends Item {
  type = ItemType.Equipment;

  public slot: EquipmentSlot;

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
    this.slot = options.slot as EquipmentSlot;

    if (options.requirements) this.requirements = options.requirements;
    if (options.attributes) this.attributes = options.attributes;
    if (options.equipmentSetId) this.equipmentSetId = options.equipmentSetId;
  }
}
