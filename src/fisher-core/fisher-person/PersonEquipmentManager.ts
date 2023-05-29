import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { EventEmitter } from 'smar-util';
import { store } from '../fisher-packages';
import { PersonEquipment } from './PersonEquipment';
import { EquipmentItem, EquipmentSet, EquipmentSlot } from '../fisher-item';
import { FisherPersonError } from '../fisher-error';
import { ActionId } from '../fisher-actions';

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

  public get equipmentActionIds() {
    const result: ActionId[] = [];

    this.equipments.forEach((personEquipment) => {
      if (!personEquipment.isEmpty) {
        result.push(...(personEquipment.equipment!.actionIds as ActionId[]));
      }
    });

    return result;
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

  public get primaryWeapon() {
    return this.equipmentMap.get(EquipmentSlot.PrimaryWeapon)!;
  }
  public get secondaryWeapon() {
    return this.equipmentMap.get(EquipmentSlot.SecondaryWeapon)!;
  }
  public get helmet() {
    return this.equipmentMap.get(EquipmentSlot.Helmet)!;
  }
  public get jacket() {
    return this.equipmentMap.get(EquipmentSlot.Jacket)!;
  }
  public get vest() {
    return this.equipmentMap.get(EquipmentSlot.Vest)!;
  }
  public get Shoe() {
    return this.equipmentMap.get(EquipmentSlot.Shoe)!;
  }
  public get handGuard() {
    return this.equipmentMap.get(EquipmentSlot.HandGuard)!;
  }
  public get belt() {
    return this.equipmentMap.get(EquipmentSlot.Belt)!;
  }
  public get necklace() {
    return this.equipmentMap.get(EquipmentSlot.Necklace)!;
  }
  public get earring() {
    return this.equipmentMap.get(EquipmentSlot.Earring)!;
  }
  public get ring() {
    return this.equipmentMap.get(EquipmentSlot.Ring)!;
  }
  public get bracelet() {
    return this.equipmentMap.get(EquipmentSlot.Bracelet)!;
  }

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

  public clearEquipments = () => {
    this.equipmentMap.forEach((personEquipment, slot) => {
      if (!personEquipment.isEmpty) {
        this.removeEquipment(slot);
      }
    });
  };

  public removeEquipment = (equipmentSlot: EquipmentSlot) => {
    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);

    if (currentSlotEquipment === undefined) {
      throw new FisherPersonError(
        `Fail to remove equipment, can not find current slot: ${equipmentSlot}`,
        '没有找到要卸下的装备'
      );
    }

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
