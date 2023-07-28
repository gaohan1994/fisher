import { makeAutoObservable } from 'mobx';
import { EventEmitter, UnsubscribeFunctionType } from 'smar-util';
import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '@shared';
import { EquipmentItem, PotionVariant } from '../fisher-item';
import { Person } from './Person';
import { PersonEquipment } from './PersonEquipment';
import { PersonEquipmentEventKeys } from './PersonEquipmentManager';
import { PotionHandlerManager } from './PotionHandlerManager';
import { PersonMode } from './Constants';
import { DeathPunish } from './DeathPunish';

const EquipmentChangeQuantity = 1;

enum MasterEventKeys {
  MasterDeath = 'MasterDeath',
}

class Master {
  public static instance: Master;

  public static create(): Master {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  }

  public static readonly MasterEventKeys = MasterEventKeys;

  public readonly id = 'Master';

  public name = '我的';

  public displayName = '';

  private _media = 'knight';

  public media = Assets[this._media as keyof typeof Assets];

  public event = new EventEmitter();

  public person = new Person(PersonMode.Master);

  public potionHandlerManager = new PotionHandlerManager();

  public get healPotionHandler() {
    return this.potionHandlerManager.potionHandlerMap.get(PotionVariant.HealPotion)!;
  }

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

  public get archive(): ArchiveInterface.ArchiveMaster {
    return {
      Hp: this.Hp,
      experience: this.person.experience.experience,
      equipmentIds: this.person.personEquipmentManager.equipmentIds,
      potionHandlers: this.potionHandlerManager.potionHandlerArchives,
    };
  }

  public disposers: UnsubscribeFunctionType[] = [];

  constructor() {
    makeAutoObservable(this);

    this.disposers = [
      events.on(EventKeys.Archive.LoadArchive, this.onLoadMaster),
      this.event.on(Master.MasterEventKeys.MasterDeath, this.deathPunish),
      this.person.personEquipmentManager.personEquipmentEvents.on(
        PersonEquipmentEventKeys.EquipmentChange,
        this.onMasterEquipmentChange
      ),
    ];
  }

  public onLoadMaster = (values: ArchiveInterface.ArchiveValues) => {
    const { master, masterName } = values;
    this.displayName = masterName;
    this.person.experience.setExperience(master?.experience ?? 0);
    this.person.personEquipmentManager.loadArchiveEquipments(master?.equipmentIds ?? []);
    this.potionHandlerManager.loadArchivePotionHandlers(master?.potionHandlers ?? []);
  };

  private deathPunish = () => {
    const punish = new DeathPunish(this.person);
    punish.executePunish();
    this.person.refreshHp();
  };

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

  public receiveExperience = (value: number) => {
    this.person.experience.receiveExperience(value);
  };
}

export { Master };
