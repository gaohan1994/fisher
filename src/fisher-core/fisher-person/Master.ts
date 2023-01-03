import { action, override } from 'mobx';
import { PersonLevel } from '../fisher-item';
import { FisherPerson } from './FisherPerson';

interface InitializeMasterPayload {
  name: string;
  level: PersonLevel;
}

export class Master extends FisherPerson {
  public static instance: Master;

  public override mode = FisherPerson.Mode.Master;

  public static getInstance = () => {
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
    FisherPerson.logger.info('master death');
  };
}

export const master = Master.getInstance();
