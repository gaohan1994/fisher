import { action, makeObservable, observable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { range } from '../utils';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { ActionManager } from './ActionsManager';
import { Experience } from '../fisher-experience';

enum PersonMode {
  Master = 'Master',
  Enemy = 'Enemy',
}

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class Person
 */
export class Person {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Person');

  public static readonly Mode = PersonMode;

  public mode: PersonMode | undefined = undefined;

  @observable
  public experience = new Experience();

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
  public target: Person | undefined = undefined;

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

  /**
   * 初始化战斗属性
   * 注册所有战斗 action
   *
   * @memberof Person
   */
  @action
  public initializeForBattle = () => {
    this.Hp = this.attributePanel.MaxHp;
  };

  @action
  public setTarget = (person: Person) => {
    this.target = person;

    if (!this.initializedForBattle) {
      this.initializeForBattle();
      this.initializedForBattle = true;
    }
  };

  @action
  public hurt = (value: number) => {
    Person.logger.debug(`${this.mode}:${this.name} hurt damage: ${value}`);
    this.Hp -= value;
  };

  @action
  public hurtRange = (value: number, rangeScope: number = 10) => {
    const damage = range(value, rangeScope);
    this.hurt(damage);
  };

  @action
  public heal = (value: number) => {
    this.Hp += value;
  };

  @action
  public startBattle = () => {
    if (!this.initialized)
      return Person.logger.error(
        `Try to start battle before initialize, Please call initialize${this.mode} method first!`
      );

    if (!this.initializedForBattle) return Person.logger.error('Try to start battle before initializedForBattle');

    this.startAttacking();
  };

  @action
  public stopBattle = () => {
    this.dispose();
    this.stopAttacking();
    this.clearEffects();
  };

  @action
  private startAttacking = () => {
    this.isAttacking = true;
    this.actionManager.startAttacking();
  };

  @action
  private stopAttacking = () => {
    this.isAttacking = false;
    this.actionManager.stopAttacking();
  };

  @action
  private clearEffects = () => {
    this.actionManager.clearActiveDotActions();
  };
}
