import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { range } from '../utils';
import { Experience } from '../fisher-experience';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { ActionManager } from './ActionsManager';
import { PersonMode } from './Constants';

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class Person
 */
export class Person {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Person');

  public mode: PersonMode;

  public get isMaster() {
    return this.mode === PersonMode.Master;
  }

  public experience = new Experience();

  public isAttacking = false;

  public target: Person | undefined = undefined;

  public personEquipmentManager = new PersonEquipmentManager();

  public attributePanel = new AttributePanel(this);

  public actionManager = new ActionManager(this);

  public Hp: number = this.attributePanel.MaxHp;

  constructor(mode: PersonMode) {
    makeAutoObservable(this);
    this.mode = mode;
  }

  public setTarget = (person: Person | undefined) => {
    this.target = person;
  };

  public clearTarget = () => {
    this.target = undefined;
  };

  public hurt = (value: number) => {
    Person.logger.debug(`${this.mode} hurt damage: ${value}`);
    this.reduceHp(value);
  };

  public hurtRange = (value: number, rangeScope: number = 10) => {
    const damage = range(value, rangeScope);
    this.hurt(damage);
  };

  public heal = (value: number) => {
    this.addHp(value);
  };

  private addHp = (value: number) => {
    this.Hp = Math.min(this.attributePanel.MaxHp, this.Hp + value);
  };

  private reduceHp = (value: number) => {
    this.Hp = Math.max(0, this.Hp - value);
  };

  public startBattle = () => {
    this.startAttacking();
  };

  public stopBattle = () => {
    this.stopAttacking();
    this.clearEffects();
  };

  private startAttacking = () => {
    this.isAttacking = true;
    this.actionManager.startAttacking();
  };

  private stopAttacking = () => {
    this.isAttacking = false;
    this.actionManager.stopAttacking();
  };

  private clearEffects = () => {
    this.actionManager.clearActiveDotActions();
  };

  public refreshHp = () => {
    this.Hp = this.attributePanel.MaxHp;
  };
}
