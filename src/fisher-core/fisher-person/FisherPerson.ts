import invariant from 'invariant';
import { action, computed, makeObservable, observable } from 'mobx';
import { EquipmentSlot, PersonLevel } from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';
import { AttributePanel } from './AttributePanel';
import { ActionManager } from './person-actions';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import type {
  IPersonRemoveEquipment,
  IPersonUseEquipment,
} from './PersonEquipmentManager';
import { PersonLevelManager } from './PersonLevelManager';
import { random, roll } from '../utils';

enum PersonMode {
  Master = 'Master',
  Enemy = 'Enemy',
}

interface IHurtOptions {
  range: boolean;
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

  public mode: PersonMode | undefined = undefined;

  @observable
  public name = 'DefaultName';

  @observable
  public initialized = false;

  @observable
  public initializedForBattle = false;

  @observable
  public isAttacking = false;

  @observable
  public Hp = Infinity;

  @observable
  public target: FisherPerson | undefined = undefined;

  @observable
  public personLevelManager = new PersonLevelManager();

  @observable
  public personEquipmentManager = new PersonEquipmentManager();

  @observable
  public attributePanel = new AttributePanel(this);

  @observable
  public actionManager = new ActionManager(this);

  constructor() {
    makeObservable(this);
  }

  @action
  public dispose() {}

  @computed
  public get Weapon() {
    const result = this.personEquipmentManager.equipmentMap.get(
      EquipmentSlot.Weapon
    );

    invariant(result !== undefined, 'Fail get Weapon');
    return result;
  }

  @computed
  public get Helmet() {
    const result = this.personEquipmentManager.equipmentMap.get(
      EquipmentSlot.Helmet
    );

    invariant(result !== undefined, 'Fail get Helmet');
    return result;
  }

  @action
  public useEquipment: IPersonUseEquipment = (...rest) => {
    this.personEquipmentManager.useEquipment(...rest);
  };

  @action
  public removeEquipment: IPersonRemoveEquipment = (...rest) => {
    this.personEquipmentManager.removeEquipment(...rest);
  };

  /**
   * 初始化战斗属性
   * 注册所有战斗 action
   *
   * @memberof FisherPerson
   */
  @action
  public initializeForBattle = () => {
    this.Hp = this.attributePanel.MaxHp;
  };

  @action
  public setTarget = (person: FisherPerson) => {
    this.target = person;

    if (!this.initializedForBattle) {
      this.initializeForBattle();
      this.initializedForBattle = true;
    }
  };

  @action
  public hurt = (value: number) => {
    this.Hp -= value;
  };

  @action
  public hurtRange = (value: number, range: number = 10) => {
    const isRaiseCorrection = roll(50);
    const correctionValue = Math.round(value * random(0, range) * 0.01);

    let hurtValue = value;
    if (isRaiseCorrection) {
      hurtValue += correctionValue;
    } else {
      hurtValue -= correctionValue;
    }

    this.Hp -= hurtValue;
  };

  @action
  public heal = (value: number) => {
    this.Hp += value;
  };

  @action
  public startBattle = () => {
    if (!this.initialized)
      return FisherPerson.logger.error(
        `Try to start battle before initialize, Please call initialize${this.mode} method first!`
      );

    if (!this.initializedForBattle)
      return FisherPerson.logger.error(
        'Try to start battle before initializedForBattle'
      );

    this.startAttacking();
  };

  @action
  public stopBattle = () => {
    this.dispose();
    this.stopAttacking();
    this.clearEffects();
  };

  @action
  public startAttacking = () => {
    this.isAttacking = true;
    this.actionManager.startAttacking();
  };

  @action
  public stopAttacking = () => {
    this.isAttacking = false;
    this.actionManager.stopAttacking();
  };

  @action
  public clearEffects = () => {
    this.actionManager.clearActiveDots();
  };
}
