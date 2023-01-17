import { action } from 'mobx';
import { EquipmentSlot } from '../fisher-item';
import { Person } from './Person';

interface InitializeMasterPayload {
  name: string;
}

export class Master extends Person {
  public static instance: Master;

  public static create = () => {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  };

  public override mode = Person.Mode.Master;

  public get weapon() {
    return this.personEquipmentManager.equipmentMap.get(EquipmentSlot.Weapon);
  }

  public get helmet() {
    return this.personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet);
  }

  /**
   * 初始化人物信息
   * 初始化人物等级
   *
   * @param {InitializeMasterPayload} { name, level }
   * @memberof Master
   */
  @action
  public initialize = ({ name }: InitializeMasterPayload) => {
    this.name = name;
    this.initialized = true;
  };

  @action
  public deathPenalty = () => {
    Person.logger.info('master death');
  };
}

export const master = Master.create();
