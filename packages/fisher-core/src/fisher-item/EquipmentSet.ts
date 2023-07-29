import { makeAutoObservable, makeObservable, observable, computed, action } from 'mobx';
import { IItem, Item, ItemType } from './Item.js';
import { EquipmentItem, IEquipmentAttribute } from './EquipmentItem.js';

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

  @observable
  public equipmentIdSet = new Set<string>();

  @computed
  public get equipmentIds() {
    return [...this.equipmentIdSet.values()];
  }

  @observable
  private activeEquipmentMap = new Map<string, EquipmentItem>();

  @computed
  public get activeEquipmentLength() {
    return this.activeEquipmentMap.size;
  }

  @observable
  public setAttributeMap = new Map<EquipmentSetSlotControl, IEquipmentAttribute[]>();

  @computed
  public get setAttributes() {
    return [...this.setAttributeMap];
  }

  @observable
  public extra: EquipmentSetExtra | undefined = undefined;

  @computed
  public get hasExtraAttributes() {
    return this.extra !== undefined;
  }

  constructor(options: IEquipmentSet) {
    super(options);
    makeObservable(this);

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

  @action
  public calculateEquipmentsActiveSetAttributes = (equipments: EquipmentItem[]) => {
    this.checkEquipmentsIsBelongToCurrentEquipmentSet(equipments);

    this.setActiveEquipmentMap(equipments);
    this.calculateSlotAttributes();
    this.calculateExtraAttributes();
  };

  @action
  private calculateSlotAttributes = () => {
    this.setAttributeMap.forEach((_, setSlotControl) => {
      if (this.activeEquipmentLength >= setSlotControl.slot) {
        setSlotControl.setEquipmentSetActive();
      } else {
        setSlotControl.setEquipmentSetInActive();
      }
    });
  };

  @action
  private calculateExtraAttributes = () => {
    if (this.extra === undefined) return;

    // if every equipment in slot was used
    // if equipment set has extra attributes
    // extra attributes bonus
    if (this.activeEquipmentLength === this.equipmentIdSet.size) {
      this.extra.setSlotControl.setEquipmentSetActive();
    } else {
      this.extra.setSlotControl.setEquipmentSetInActive();
    }
  };

  @action
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

  @action
  private setActiveEquipmentMap = (equipments: EquipmentItem[]) => {
    this.activeEquipmentMap.clear();

    for (let index = 0; index < equipments.length; index++) {
      const equipment = equipments[index];
      this.activeEquipmentMap.set(equipment.id, equipment);
    }
  };

  @action
  public checkEquipmentIsActive = (equipment: EquipmentItem) => {
    return this.activeEquipmentMap.has(equipment.id);
  };
}

export class EquipmentSetExtra {
  public setSlotControl: EquipmentSetSlotControl;
  public attributes: IEquipmentAttribute[];

  constructor(equipmentsFullSlotCount: number, attributes: IEquipmentAttribute[]) {
    makeAutoObservable(this);
    this.setSlotControl = new EquipmentSetSlotControl(equipmentsFullSlotCount);
    this.attributes = attributes;
  }
}

export class EquipmentSetSlotControl {
  public slot: number;
  public active: boolean = false;

  constructor(slot: number) {
    makeAutoObservable(this);
    this.slot = slot;
  }

  public setEquipmentSetActive = () => {
    this.active = true;
  };

  public setEquipmentSetInActive = () => {
    this.active = false;
  };
}
