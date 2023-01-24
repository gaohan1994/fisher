import { EventEmitter } from 'smar-util';
import { action, computed, makeObservable, observable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { store } from '../fisher-packages';
import { PersonEquipment } from './PersonEquipment';
import { EventKeys, events } from '../fisher-events';
import { EquipmentItem, EquipmentSet, EquipmentSlot } from '../fisher-item';

enum PersonEquipmentManagerEvents {
  EquipmentChange = 'EquipmentChange',
}

/**
 * @export
 * @class PersonEquipmentManager
 */
export class PersonEquipmentManager extends EventEmitter {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'PersonEquipmentManager');

  @observable
  public equipmentMap: Map<EquipmentSlot, PersonEquipment> = new Map();

  @computed
  public get equipments() {
    return [...this.equipmentMap.values()];
  }

  @observable
  public equipmentSetMap = new Map<EquipmentSet, EquipmentItem[]>();

  @computed
  public get equipmentSets() {
    return [...this.equipmentSetMap.keys()];
  }

  constructor() {
    super();
    makeObservable(this);

    this.equipmentMap.set(EquipmentSlot.Weapon, new PersonEquipment({ slot: EquipmentSlot.Weapon }));
    this.equipmentMap.set(EquipmentSlot.Helmet, new PersonEquipment({ slot: EquipmentSlot.Helmet }));

    this.on(PersonEquipmentManagerEvents.EquipmentChange, this.onPersonEquipmentChange);
  }

  /**
   * use equipment
   * if previous equipment wasn't empty
   * put unused equipment to backpack
   *
   * @param {EquipmentSlot} equipmentSlot
   * @param {EquipmentItem} equipment
   * @memberof PersonEquipmentManager
   */
  @action
  public useEquipment = (equipment: EquipmentItem) => {
    const { slot } = equipment;
    const currentSlotEquipment = this.equipmentMap.get(slot);

    if (currentSlotEquipment === undefined) {
      PersonEquipmentManager.logger.error(`Fail to use equipment, can not find current slot: ${slot}`, this, equipment);
      throw new Error(`Fail to use equipment, can not find current slot: ${slot}`);
    }

    const result = currentSlotEquipment.updateEquipment(equipment, 1);
    this.equipmentMap.set(slot, currentSlotEquipment);

    const [previousEquipment, previousQuantity] = [result?.[0], result?.[1]];
    this.emit(PersonEquipmentManagerEvents.EquipmentChange, currentSlotEquipment, previousEquipment, previousQuantity);

    PersonEquipmentManager.logger.debug(`use equipment, slot: ${slot} equipmentId ${equipment.id}`);
  };

  /**
   * remove equipment
   * if previous equipment wasn't empty
   * put removed equipment to backpack
   *
   * @param {EquipmentSlot} equipmentSlot
   * @memberof PersonEquipmentManager
   */
  @action
  public removeEquipment = (equipmentSlot: EquipmentSlot) => {
    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);

    if (currentSlotEquipment === undefined)
      return PersonEquipmentManager.logger.error(
        `Fail to remove equipment, can not find current slot: ${equipmentSlot}`
      );

    const [previousEquipment, previousQuantity] = currentSlotEquipment.removeEquipment();
    this.equipmentMap.set(equipmentSlot, currentSlotEquipment);

    this.emit(PersonEquipmentManagerEvents.EquipmentChange, currentSlotEquipment, previousEquipment, previousQuantity);

    PersonEquipmentManager.logger.debug(
      `remove equipment, slot: ${equipmentSlot} equipmentId ${previousEquipment.id}, quantity: ${previousQuantity}`
    );
  };

  @action
  public getActiveEquipmentSetById(equipmentSetId: string) {
    return this.equipmentSets.find((item) => item.id === equipmentSetId);
  }

  @action
  private onPersonEquipmentChange = (
    currentPersonEquipment: PersonEquipment,
    previousEquipment: EquipmentItem | undefined = undefined,
    previousQuantity: number = 1
  ) => {
    if (!currentPersonEquipment.isEmpty) {
      this.reduceEquipmentAfterUseEquipment(currentPersonEquipment.equipment!, currentPersonEquipment.quantity);
    }

    if (previousEquipment !== undefined) {
      this.putEquipmentToBackpack(previousEquipment, previousQuantity);
    }

    // clear equipment set effects before recalculate
    this.clearEquipmentSetEffectBeforeRecalculate();
    this.callculateEquipmentSets();
  };

  @action
  private clearEquipmentSetEffectBeforeRecalculate = () => {
    this.equipmentSetMap.forEach((_, equipmentSet) => {
      equipmentSet.calculateEquipmentsActiveSetAttributes([]);
    });

    this.equipmentSetMap.clear();
  };

  @action
  private callculateEquipmentSets = () => {
    // calculate equipment set map first
    // then calculate active equipment set attributes
    this.calculateEquipmentSetMap();
    this.calculateActiveEquipmentSetsAttributes();
  };

  @action
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

  @action
  private calculateActiveEquipmentSetsAttributes = () => {
    this.equipmentSetMap.forEach((equipments, equipmentSet) => {
      equipmentSet.calculateEquipmentsActiveSetAttributes(equipments);
    });
  };

  @action
  private putEquipmentToBackpack = (equipment: EquipmentItem, quantity: number) => {
    events.emit(EventKeys.Backpack.AddItem, equipment, quantity);
  };

  @action
  private reduceEquipmentAfterUseEquipment = (equipment: EquipmentItem, quantity: number) => {
    events.emit(EventKeys.Backpack.ReduceItem, equipment, quantity);
  };
}
