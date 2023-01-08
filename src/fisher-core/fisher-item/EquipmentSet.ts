import { IItem, Item, ItemType } from './Item';
import { EquipmentItem, IEquipmentAttribute } from './EquipmentItem';

export interface IEquipmentSet extends IItem {
  equipmentIds: string[];
  setAttributes: ISetAtttribute[];
  extraAttributes?: IEquipmentAttribute[];
}

interface ISetAtttribute {
  slot: number;
  attributes: IEquipmentAttribute[];
}

export class EquipmentSet extends Item {
  type = ItemType.EquipmentSet;

  public equipmentIdSet = new Set<string>();

  public setAttributeMap = new Map<EquipmentSetSlotControl, IEquipmentAttribute[]>();

  public get setAttributes() {
    return [...this.setAttributeMap];
  }

  public extra: EquipmentSetExtra | undefined = undefined;

  public get hasExtraAttributes() {
    return this.extra !== undefined;
  }

  constructor(options: IEquipmentSet) {
    super(options);

    // initialize equipment slot id
    for (let index = 0; index < options.equipmentIds.length; index++) {
      const equipmentId = options.equipmentIds[index];
      this.equipmentIdSet.add(equipmentId);
    }

    // initialize set attributes
    for (let index = 0; index < options.setAttributes.length; index++) {
      const { slot, attributes } = options.setAttributes[index];
      this.setAttributeMap.set(new EquipmentSetSlotControl(slot), attributes);
    }

    if (options.extraAttributes) {
      this.extra = new EquipmentSetExtra(this.equipmentIdSet.size, options.extraAttributes);
    }
  }

  public calculateEquipmentsActiveSetAttributes = (equipments: EquipmentItem[]) => {
    this.checkEquipmentsIsBelongToCurrentEquipmentSet(equipments);

    this.calculateSlotAttributes(equipments);

    this.calculateExtraAttributes(equipments);
  };

  private calculateSlotAttributes = (equipments: EquipmentItem[]) => {
    this.setAttributeMap.forEach((_, setSlotControl) => {
      if (equipments.length >= setSlotControl.slot) {
        setSlotControl.setEquipmentSetActive();
      } else {
        setSlotControl.setEquipmentSetInActive();
      }
    });
  };

  private calculateExtraAttributes = (equipments: EquipmentItem[]) => {
    if (this.extra === undefined) return;

    // if every equipment in slot was used
    // if equipment set has extra attributes
    // extra attributes bonus
    if (equipments.length === this.equipmentIdSet.size) {
      this.extra.setSlotControl.setEquipmentSetActive();
    } else {
      this.extra.setSlotControl.setEquipmentSetInActive();
    }
  };

  private checkEquipmentsIsBelongToCurrentEquipmentSet = (equipments: EquipmentItem[]) => {
    for (let index = 0; index < equipments.length; index++) {
      const equipment = equipments[index];

      // throw error if this equipment set doesn't have received equipments id
      if (!this.equipmentIdSet.has(equipment.id))
        throw new Error(
          `Try to calculate equipment set ${this.id} but equipment ${equipment.id} does not belong to this equipment set`
        );
    }
  };
}

export class EquipmentSetExtra {
  public setSlotControl: EquipmentSetSlotControl;
  public attributes: IEquipmentAttribute[];

  constructor(equipmentsFullSlotCount: number, attributes: IEquipmentAttribute[]) {
    this.setSlotControl = new EquipmentSetSlotControl(equipmentsFullSlotCount);
    this.attributes = attributes;
  }
}

class EquipmentSetSlotControl {
  public slot: number;
  public active: boolean = false;

  constructor(slot: number) {
    this.slot = slot;
  }

  public setEquipmentSetActive = () => {
    this.active = true;
  };

  public setEquipmentSetInActive = () => {
    this.active = false;
  };
}
