import { makeAutoObservable } from 'mobx';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '../fisher-events';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { PersonMode } from './Constants';
import { Person } from './Person';
import { PersonEquipment } from './PersonEquipment';
import { PersonEquipmentEventKeys } from './PersonEquipmentManager';

class Master {
  public static instance: Master;

  public static create(): Master {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  }

  public readonly id = 'Master';

  public name = '角色名称';

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

  public get helmet() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet);
  }

  public get archive(): ArchiveInterface.ArchiveMaster {
    return {};
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
    // this.person.experience.setExperience(0);
    // this.person.personEquipmentManager.loadArchiveEquipments();
  };

  public deathPenalty = () => {};

  private onMasterEquipmentChange = (
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
