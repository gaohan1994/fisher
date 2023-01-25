import { makeAutoObservable } from 'mobx';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '../fisher-events';
import { EquipmentSlot } from '../fisher-item';
import { PersonMode } from './Constants';
import { Person } from './Person';

class Master {
  public static instance: Master;

  public static create(): Master {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  }

  public readonly id = 'Master';

  public person = new Person(this.id);

  public name = '角色名称';

  private _media = 'knight';

  public media = Assets[this._media as keyof typeof Assets];

  public mode = PersonMode.Master;

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

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Archive.LoadArchive, this.onLoadMaster);
  }

  private onLoadMaster = (values: ArchiveInterface.ArchiveValues) => {};

  public deathPenalty = () => {};
}

const master = Master.create();

export { master, Master };
