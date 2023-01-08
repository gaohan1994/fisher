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

  // if every equipment in slot was used
  // if equipment set has extra attributes
  // extra attributes bonus
  public extraAttributes: IEquipmentAttribute[] | undefined = undefined;

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
  }

  public calculateEquipmentsActiveSetAttributes = (equipments: EquipmentItem[]) => {
    this.checkEquipmentsIsBelongToCurrentEquipmentSet(equipments);

    this.setAttributeMap.forEach((_, setSlotControl) => {
      if (equipments.length >= setSlotControl.slot) {
        setSlotControl.setEquipmentSetActive();
      } else {
        setSlotControl.setEquipmentSetInActive();
      }
    });
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
