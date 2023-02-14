import { makeAutoObservable } from 'mobx';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '../fisher-events';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { PersonMode } from './Constants';
import { Person } from './Person';
import { PersonEquipment } from './PersonEquipment';
import { PersonEquipmentEventKeys } from './PersonEquipmentManager';

const EquipmentChangeQuantity = 1;

class Master {
  public static instance: Master;

  public static create(): Master {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  }

  public readonly id = 'Master';

  public name = '角色';

  public displayName = '';

  private _media = 'knight';

  public media = Assets[this._media as keyof typeof Assets];

  public mode = PersonMode.Master;

  public person = new Person(this.mode);

  public get level() {
    return this.person.experience.level;
  }

  public get Hp() {
    return this.person.Hp;
  }

  public get attributePanel() {
    return this.person.attributePanel;
  }

  public get actionManager() {
    return this.person.actionManager;
  }

  public get personEquipmentManager() {
    return this.person.personEquipmentManager;
  }

  public get primaryWeapon() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.PrimaryWeapon);
  }
  public get secondaryWeapon() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.SecondaryWeapon);
  }
  public get helmet() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet);
  }
  public get jacket() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Jacket);
  }
  public get vest() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Vest);
  }
  public get Shoe() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Shoe);
  }
  public get handGuard() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.HandGuard);
  }
  public get belt() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Belt);
  }
  public get necklace() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Necklace);
  }
  public get earring() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Earring);
  }
  public get ring() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Ring);
  }
  public get bracelet() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Bracelet);
  }

  public get archive(): ArchiveInterface.ArchiveMaster {
    return {
      experience: this.person.experience.experience,
      equipmentIds: this.person.personEquipmentManager.equipmentIds,
    };
  }

  constructor() {
    makeAutoObservable(this);

    events.on(EventKeys.Archive.LoadArchive, this.onLoadMaster);
    this.person.personEquipmentManager.personEquipmentEvents.on(
      PersonEquipmentEventKeys.EquipmentChange,
      this.onMasterEquipmentChange
    );
  }

  private onLoadMaster = (values: ArchiveInterface.ArchiveValues) => {
    const { master, masterName } = values;
    this.displayName = masterName;
    this.person.experience.setExperience(master?.experience ?? 0);
    this.person.personEquipmentManager.loadArchiveEquipments(master?.equipmentIds ?? []);
  };

  public deathPenalty = () => {};

  private onMasterEquipmentChange = (
    currentPersonEquipment: PersonEquipment,
    previousEquipment: EquipmentItem | undefined = undefined
  ) => {
    if (!currentPersonEquipment.isEmpty) {
      this.reduceEquipmentAfterUseEquipment(currentPersonEquipment.equipment!, EquipmentChangeQuantity);
    }

    if (previousEquipment !== undefined) {
      this.putEquipmentToBackpack(previousEquipment, EquipmentChangeQuantity);
    }

    events.emit(EventKeys.Archive.SaveFullArchive);
  };

  private putEquipmentToBackpack = (equipment: EquipmentItem, quantity: number) => {
    events.emit(EventKeys.Backpack.AddItem, equipment, quantity);
  };

  private reduceEquipmentAfterUseEquipment = (equipment: EquipmentItem, quantity: number) => {
    events.emit(EventKeys.Backpack.ReduceItem, equipment, quantity);
  };
}

const master = Master.create();

export { master, Master };
