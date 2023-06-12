import { EquipmentSlot } from './Constants';
import { Item, ItemType, IItem } from './Item';

export interface IEquipmentItem extends IItem {
  slot: EquipmentSlot[number];
  requirements?: IEquipmentRequirement[];
  attributes?: IEquipmentAttribute[];
  equipmentSetId?: string;
  attackSpeed?: number;
  actionIds?: string[];
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
  key: string;
  value: number;
}

export class EquipmentItem extends Item {
  type = ItemType.Equipment;

  public slot: EquipmentSlot;

  public requirements: IEquipmentRequirement[] = [];

  public attributes: IEquipmentAttribute[] = [];

  public attackSpeed: number | undefined = undefined;

  public actionIds: string[] = [];

  public get hasEquipmentAction() {
    return this.actionIds.length > 0;
  }

  public get hasAttributes() {
    return this.attributes.length > 0;
  }

  public equipmentSetId?: string | undefined = undefined;

  public get hasEquipmentSet() {
    return this.equipmentSetId !== undefined;
  }

  constructor(options: IEquipmentItem) {
    let media: string;

    if (options.media && options.media.length > 0) {
      media = options.media;
    } else {
      media = options.slot + (options.rarity ?? 'Common');
    }
    super(Object.assign({}, options, { media }));

    this.slot = options.slot as EquipmentSlot;

    if (options.requirements) this.requirements = options.requirements;
    if (options.attributes) this.attributes = options.attributes;
    if (options.equipmentSetId) this.equipmentSetId = options.equipmentSetId;
    if (options.attackSpeed) this.attackSpeed = options.attackSpeed;
    if (options.actionIds) this.actionIds = options.actionIds;
  }
}
