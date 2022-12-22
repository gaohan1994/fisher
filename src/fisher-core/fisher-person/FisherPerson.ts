import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { prefixes, prefixLogger } from '@FisherLogger';
import { FisherEquipmentSlot } from '@FisherCore';
import {
  FisherPersonEquipmentManager,
  IFisherPersonRemoveEquipment,
  IFisherPersonUseEquipment,
} from './FisherPersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { FisherPersonLevel, PersonLevel } from './fisher-person-level';

enum PersonMode {
  Master = 'Master',
  Enemy = 'Enemy',
}

interface IFisherPerson {
  mode: PersonMode;
  name: string;
  level: PersonLevel;
}

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class FisherPerson
 */
export class FisherPerson {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'FisherPerson');
  public static readonly Mode = PersonMode;
  public static readonly Level = PersonLevel;

  public initialized: boolean = false;

  public mode?: PersonMode = undefined;

  public name: string = 'DefaultName';

  public Hp: number = Infinity;

  public personLevel: FisherPersonLevel = new FisherPersonLevel();

  public personEquipmentManager: FisherPersonEquipmentManager =
    new FisherPersonEquipmentManager();

  public attributePanel: AttributePanel = new AttributePanel(this);

  constructor() {
    makeAutoObservable(this);
  }

  public initialize = ({ mode, name, level }: IFisherPerson) => {
    if (this.initialized) {
      FisherPerson.logger.error(`Already initialized person ${this.name}`);
      return;
    }
    this.mode = mode;
    this.name = name;
    this.personLevel.initialize({ level });
    this.initialized = true;
  };

  public get Weapon() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Weapon
    );
    invariant(result !== undefined, 'Fail get Weapon');
    return result;
  }

  public get Helmet() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Helmet
    );
    invariant(result !== undefined, 'Fail get Helmet');
    return result;
  }

  public useEquipment: IFisherPersonUseEquipment = (...rest) => {
    this.personEquipmentManager.useEquipment(...rest);
  };

  public removeEquipment: IFisherPersonRemoveEquipment = (...rest) => {
    this.personEquipmentManager.removeEquipment(...rest);
  };

  /**
   * 初始化战斗属性
   *
   * @memberof FisherPerson
   */
  public initializeBattleAttributes = () => {
    this.Hp = Math.min(this.Hp, this.attributePanel.MaxHp);
  };

  /**
   * 人物死亡回调
   *
   * @memberof FisherPerson
   */
  public personDeath = () => {
    FisherPerson.logger.info(`${this?.mode} ${this.name} death`);
  };

  /**
   * 攻击动作
   * 对 target 攻击
   *
   * @param {FisherPerson} target
   * @memberof FisherPerson
   */
  public attackAction = () => {};
}
