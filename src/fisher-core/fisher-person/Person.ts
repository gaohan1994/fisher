import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { range } from '../utils';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { ActionManager } from './ActionsManager';
import { Experience } from '../fisher-experience';

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class Person
 */
export class Person {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Person');

  public id: string;

  public experience = new Experience();

  public isAttacking = false;

  public target: Person | undefined = undefined;

  public personEquipmentManager = new PersonEquipmentManager();

  public attributePanel = new AttributePanel(this);

  public actionManager = new ActionManager(this);

  public Hp = this.attributePanel.MaxHp;

  constructor(id: string) {
    makeAutoObservable(this);
    this.id = id;
  }

  public setTarget = (person: Person) => {
    this.target = person;
  };

  public hurt = (value: number) => {
    Person.logger.debug(`${this.id} hurt damage: ${value}`);
    this.Hp -= value;
  };

  public hurtRange = (value: number, rangeScope: number = 10) => {
    const damage = range(value, rangeScope);
    this.hurt(damage);
  };

  public heal = (value: number) => {
    this.Hp += value;
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
}
