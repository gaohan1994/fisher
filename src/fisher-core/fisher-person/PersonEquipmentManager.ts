import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { EventEmitter } from 'smar-util';
import { store } from '../fisher-packages';
import { PersonEquipment } from './PersonEquipment';
import { EquipmentItem, EquipmentSet, EquipmentSlot } from '../fisher-item';

enum PersonEquipmentEventKeys {
  EquipmentChange = 'EquipmentChange',
}

/**
 * @export
 * @class PersonEquipmentManager
 */
class PersonEquipmentManager {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'PersonEquipmentManager');

  public equipmentMap: Map<EquipmentSlot, PersonEquipment> = new Map();

  public get equipments() {
    return [...this.equipmentMap.values()];
  }

  public get equipmentIds() {
    let result: string[] = [];

    for (let index = 0; index < this.equipments.length; index++) {
      const personEquipment = this.equipments[index];
      if (!personEquipment.isEmpty) {
        result.push(personEquipment.equipment!.id);
      }
    }

    return result;
  }

  public equipmentSetMap = new Map<EquipmentSet, EquipmentItem[]>();

  public get equipmentSets() {
    return [...this.equipmentSetMap.keys()];
  }

  public personEquipmentEvents = new EventEmitter();

  constructor() {
    makeAutoObservable(this);
    this.initializeEquipmentMap();
    this.personEquipmentEvents.on(PersonEquipmentEventKeys.EquipmentChange, this.onPersonEquipmentChange);
  }

  private initializeEquipmentMap = () => {
    for (const key in EquipmentSlot) {
      if (Object.prototype.hasOwnProperty.call(EquipmentSlot, key)) {
        const slot = EquipmentSlot[key as EquipmentSlot];
        this.equipmentMap.set(slot, new PersonEquipment(slot));
      }
    }
  };

  public loadArchiveEquipments = (equipmentIds: string[]) => {
    this.initializeEquipmentMap();

    for (let index = 0; index < equipmentIds.length; index++) {
      const equipmentId = equipmentIds[index];
      const equipment = store.findEquipmentById(equipmentId);
      this.setEquipment(equipment);
    }

    this.callculateEquipmentSets();
  };

  public setEquipment = (equipment: EquipmentItem) => {
    const { slot } = equipment;
    const currentSlotEquipment = this.equipmentMap.get(slot);

    if (currentSlotEquipment === undefined) {
      PersonEquipmentManager.logger.error(`Fail to use equipment, can not find current slot: ${slot}`, equipment);
      throw new Error(`Fail to use equipment, can not find current slot: ${slot}`);
    }

    const previousEquipment = currentSlotEquipment.updateEquipment(equipment);
    this.equipmentMap.set(slot, currentSlotEquipment);

    return [currentSlotEquipment, previousEquipment];
  };

  public useEquipment = (equipment: EquipmentItem) => {
    const [currentSlotEquipment, previousEquipment] = this.setEquipment(equipment);

    this.personEquipmentEvents.emit(PersonEquipmentEventKeys.EquipmentChange, currentSlotEquipment, previousEquipment);
    PersonEquipmentManager.logger.debug(`use equipment, slot: ${equipment.slot} equipmentId ${equipment.id}`);
  };

  public removeEquipment = (equipmentSlot: EquipmentSlot) => {
    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);

    if (currentSlotEquipment === undefined)
      return PersonEquipmentManager.logger.error(
        `Fail to remove equipment, can not find current slot: ${equipmentSlot}`
      );

    const previousEquipment = currentSlotEquipment.removeEquipment();
    this.equipmentMap.set(equipmentSlot, currentSlotEquipment);

    this.personEquipmentEvents.emit(PersonEquipmentEventKeys.EquipmentChange, currentSlotEquipment, previousEquipment);
    PersonEquipmentManager.logger.debug(`remove equipment, slot: ${equipmentSlot} equipmentId ${previousEquipment.id}`);
  };

  public getActiveEquipmentSetById(equipmentSetId: string) {
    return this.equipmentSets.find((item) => item.id === equipmentSetId);
  }

  private onPersonEquipmentChange = () => {
    this.callculateEquipmentSets();
  };

  private callculateEquipmentSets = () => {
    this.clearEquipmentSetEffectBeforeRecalculate();
    this.calculateEquipmentSetMap();
    this.calculateActiveEquipmentSetsAttributes();
  };

  private clearEquipmentSetEffectBeforeRecalculate = () => {
    this.equipmentSetMap.forEach((_, equipmentSet) => {
      equipmentSet.calculateEquipmentsActiveSetAttributes([]);
    });

    this.equipmentSetMap.clear();
  };

  private calculateEquipmentSetMap = () => {
    this.equipmentMap.forEach((personEquipment) => {
      const { equipment } = personEquipment;

      if (equipment !== undefined && equipment.hasEquipmentSet) {
        const equipmentSet = store.findEquipmentSetById(equipment.equipmentSetId ?? '');
        let equipments: EquipmentItem[];

        if (this.equipmentSetMap.has(equipmentSet)) {
          equipments = this.equipmentSetMap.get(equipmentSet) ?? [];
          equipments.push(equipment);
        } else {
          equipments = [equipment];
        }

        this.equipmentSetMap.set(equipmentSet, equipments);
      }
    });
  };

  private calculateActiveEquipmentSetsAttributes = () => {
    this.equipmentSetMap.forEach((equipments, equipmentSet) => {
      equipmentSet.calculateEquipmentsActiveSetAttributes(equipments);
    });
  };
}

export { PersonEquipmentManager, PersonEquipmentEventKeys };
