import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { EmptyEquipment, EquipmentItem, EquipmentSlot } from '@item';

/**
 * 人物装备
 *
 * @export
 * @class PersonEquipment
 */
export class PersonEquipment {
  public emptyEquipment: EmptyEquipment;

  public equipment: EquipmentItem | undefined;

  public slot: EquipmentSlot;

  constructor(slot: EquipmentSlot, equipment?: EquipmentItem) {
    makeAutoObservable(this);
    this.slot = slot;
    this.equipment = equipment;
    this.emptyEquipment = new EmptyEquipment(this.slot);
  }

  public get isEmpty(): boolean {
    return this.equipment === undefined;
  }

  public updateEquipment = (value: EquipmentItem): EquipmentItem | undefined => {
    let result: EquipmentItem | undefined = undefined;
    if (!this.isEmpty) {
      result = this.equipment;
    }

    this.equipment = value;
    return result;
  };

  public removeEquipment = (): EquipmentItem => {
    invariant(this.isEmpty !== true, 'Fail to remove equipment, current slot equipment was empty');
    const result: EquipmentItem = this.equipment!;

    this.equipment = undefined;

    return result;
  };
}
