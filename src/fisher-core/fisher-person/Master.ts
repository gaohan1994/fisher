import { makeAutoObservable } from 'mobx';
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

  public person = new Person('Master');

  public name = '';

  public mode = PersonMode.Master;

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

  public get weapon() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Weapon);
  }

  public get helmet() {
    return this.person.personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet);
  }

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Archive.LoadArchive, this.onLoadMaster);
  }

  private onLoadMaster = (values: ArchiveInterface.ArchiveValues) => {};

  public deathPenalty = () => {
    Person.logger.info('master death');
  };

  public setTarget = (person: Person) => {
    this.person.setTarget(person);
  };

  public startBattle = () => {
    this.person.startBattle();
  };

  public stopBattle = () => {
    this.person.stopBattle();
  };
}

const master = Master.create();

export { master, Master };
