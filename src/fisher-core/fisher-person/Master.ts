import { action } from 'mobx';
import { PersonLevel } from '../fisher-item';
import { Person } from './Person';

interface InitializeMasterPayload {
  name: string;
  level: PersonLevel;
}

export class Master extends Person {
  public static instance: Master;

  public override mode = Person.Mode.Master;

  public static create = () => {
    if (!Master.instance) {
      Master.instance = new Master();
    }
    return Master.instance;
  };

  /**
   * 初始化人物信息
   * 初始化人物等级
   *
   * @param {InitializeMasterPayload} { name, level }
   * @memberof Master
   */
  @action
  public initialize = ({ name, level }: InitializeMasterPayload) => {
    this.name = name;
    this.personLevelManager.initialize(level);
    this.actionManager.registerActionMap();
    this.initialized = true;
  };

  @action
  public deathPenalty = () => {
    Person.logger.info('master death');
  };
}

export const master = Master.create();
