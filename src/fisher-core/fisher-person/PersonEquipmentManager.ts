import { EventEmitter } from 'smar-util';
import { action, computed, makeObservable, observable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { EquipmentItem, EquipmentSet, EquipmentSlot } from '../fisher-item';
import { store } from '../fisher-packages';
import { PersonEquipment } from './PersonEquipment';
import { backpack } from '../fisher-backpack';

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
  public useEquipment = (equipmentSlot: EquipmentSlot, equipment: EquipmentItem) => {
    this.checkIsValidEquipmentSlot(equipmentSlot, equipment);

    const currentSlotEquipment = this.equipmentMap.get(equipmentSlot);

    if (currentSlotEquipment === undefined)
      return PersonEquipmentManager.logger.error(`Fail to use equipment, can not find current slot: ${equipmentSlot}`);

    const result = currentSlotEquipment.updateEquipment(equipment, 1);
    this.equipmentMap.set(equipmentSlot, currentSlotEquipment);

    const [previousEquipment, previousQuantity] = [result?.[0], result?.[1]];
    this.emit(PersonEquipmentManagerEvents.EquipmentChange, currentSlotEquipment, previousEquipment, previousQuantity);

    PersonEquipmentManager.logger.debug(`use equipment, slot: ${equipmentSlot} equipmentId ${equipment.id}`);
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

  private checkIsValidEquipmentSlot = (equipmentSlot: EquipmentSlot, equipment: EquipmentItem) => {
    if (!equipment.slots.includes(equipmentSlot))
      throw new Error(
        `Fail to use equipment ${equipment.id}, can not match slot, equipmentSlot: ${equipment.slots} expect slot: ${equipmentSlot}`
      );
  };

  @action
  public getActiveEquipmentSetById(equipmentSetId: string) {
    return this.equipmentSets.find((item) => item.id === equipmentSetId);
  }

  @action
  private onPersonEquipmentChange = (
    personEquipment: PersonEquipment,
    previousEquipment: EquipmentItem | undefined = undefined,
    previousQuantity: number = 1
  ) => {
    if (previousEquipment !== undefined) {
      this.putEquipmentToBackpack(previousEquipment, previousQuantity);
    }

    // calculate equipment set info if equipment changed
    // check if each equipment has equipmentSetId
    // if has equipmentSetId then set into equipmentSetMap
    this.calculateEquipmentSetMap();
  };

  @action
  private calculateEquipmentSetMap = () => {
    // clear active equipment set first
    this.equipmentSetMap.clear();

    this.equipmentMap.forEach((personEquipment) => {
      const { equipment } = personEquipment;

      if (equipment.hasEquipmentSet) {
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

    this.calculateActiveEquipmentSetsAttributes();
  };

  @action
  private calculateActiveEquipmentSetsAttributes = () => {
    this.equipmentSetMap.forEach((equipments, equipmentSet) => {
      equipmentSet.calculateEquipmentsActiveSetAttributes(equipments);
    });
  };

  @action
  private putEquipmentToBackpack = (equipment: EquipmentItem, quantity: number) => {
    backpack.addItem(equipment, quantity);
  };
}
