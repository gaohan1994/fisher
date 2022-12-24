import { override } from 'mobx';
import { PersonLevel } from './fisher-person-level';
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
  @override
  public initialize({ name, level }: InitializeMasterPayload): void {
    this.name = name;
    this.personLevel.initialize({ level });
    this.initialized = true;
  }
}

export const master = Master.getInstance();
