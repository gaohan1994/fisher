import { autorun, makeAutoObservable } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixes, prefixLogger } from '@FisherLogger';
import { range } from '../utils';
import { Experience } from '../fisher-experience';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { ActionManager } from './ActionsManager';
import { getPersonFactorConfig, PersonMode } from './Constants';
import { ActionId } from '../fisher-actions';

interface PersonEventActionPayload {
  value: number;
  currentHp: number;
}

enum PersonEventKeys {
  Hurt = 'Hurt',
  Heal = 'Heal',
  TargetChange = 'TargetChange',
}

interface IPersonOptions {
  level?: number;
  actionIds: ActionId[];
}

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class Person
 */
class Person {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Person');

  public static readonly PersonEventKeys = PersonEventKeys;

  public mode: PersonMode;

  private options: IPersonOptions;

  public get isMaster() {
    return this.mode === PersonMode.Master;
  }

  public experience = new Experience();

  public isAttacking = false;

  public target: Person | undefined = undefined;

  public personEquipmentManager: PersonEquipmentManager;

  public attributePanel: AttributePanel;

  public actionManager: ActionManager;

  public Hp: number;

  public event = new EventEmitter();

  public get personActionIds() {
    return [...this.personEquipmentManager.equipmentActionIds, ...this.options.actionIds];
  }

  constructor(mode: PersonMode, options: IPersonOptions = { level: 0, actionIds: [] }) {
    makeAutoObservable(this);

    this.mode = mode;
    this.options = options;

    if (options.level !== undefined && options.level > 0) {
      this.experience.setLevel(options.level);
    }

    this.personEquipmentManager = new PersonEquipmentManager();

    this.actionManager = new ActionManager(this, this.personActionIds);

    this.attributePanel = new AttributePanel(this, getPersonFactorConfig(this.mode));

    this.Hp = this.attributePanel.MaxHp;

    autorun(() => {
      this.actionManager.registerActions(this.personActionIds);
    });
  }

  public setTarget = (person: Person | undefined) => {
    this.target = person;

    this.event.emit(Person.PersonEventKeys.TargetChange, { target: person });
  };

  public clearTarget = () => {
    this.target = undefined;

    this.event.emit(Person.PersonEventKeys.TargetChange, { target: undefined });
  };

  public hurt = (value: number) => {
    this.Hp = Math.max(0, this.Hp - value);

    this.event.emit(Person.PersonEventKeys.Hurt, {
      value,
      currentHp: this.Hp,
    });

    Person.logger.debug(`${this.mode} hurt damage: ${value}`);
  };

  public hurtRange = (value: number, rangeScope: number = 10) => {
    const damage = range(value, rangeScope);
    this.hurt(damage);
  };

  public heal = (value: number) => {
    this.Hp = Math.min(this.attributePanel.MaxHp, this.Hp + value);

    this.event.emit(Person.PersonEventKeys.Heal, {
      value,
      currentHp: this.Hp,
    });

    Person.logger.debug(`${this.mode} heal hp: ${value}`);
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
    this.actionManager.clearActionsEffects();
  };

  public refreshHp = () => {
    this.Hp = this.attributePanel.MaxHp;
  };
}

export { Person };
export type { PersonEventActionPayload };
