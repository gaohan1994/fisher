import numeral from 'numeral';
import { prefixes, prefixLogger } from '@FisherLogger';
import { Timer } from '../fisher-timer';
import { IBonuesBuffAttributes, IBonusBuffAttributesKeys, Person } from '../fisher-person';
import { Assets } from '../assets';
import { ActionId, ActionMode } from './Constants';

interface IBaseAction {
  readonly id: string;

  readonly mode: ActionMode;

  readonly name: string;
}

export interface IExecuteActionDispose {
  (): void;
}

export abstract class BaseAction implements IBaseAction {
  abstract readonly id: ActionId;

  abstract readonly mode: ActionMode;

  abstract readonly name: string;

  abstract chance: number;
}

export abstract class BaseAttackAction extends BaseAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseAttackAction');

  public readonly mode = ActionMode.Attack;

  abstract execute(person: Person): IExecuteActionDispose | void;
}

export abstract class BaseHealAction extends BaseAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseHealAction');

  public readonly mode = ActionMode.Heal;

  abstract hpThreshold: number;

  abstract execute(person: Person): IExecuteActionDispose | void;

  public checkHpThreshold = (person: Person) => {
    const personHpThreshold = numeral(person.Hp / person.attributePanel.MaxHp).value() ?? 1;
    return this.hpThreshold >= personHpThreshold;
  };
}

export abstract class BaseDotAction extends BaseAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseDotAction');

  public readonly mode = ActionMode.Dot;

  public abstract get interval(): number;

  public abstract effectiveTimes: number;

  public abstract totalEffectiveTimes: number;

  public get remainingEffectiveTimes() {
    return this.totalEffectiveTimes - this.effectiveTimes;
  }

  public get isFinished() {
    return this.effectiveTimes >= this.totalEffectiveTimes;
  }

  public get media() {
    return Assets[this.id as any as keyof typeof Assets];
  }

  public abstract readonly timer: Timer;

  public abstract initialize(person: Person): void;

  public abstract effective(): void;

  public abstract abort(): void;

  public abstract damage(): number;
}

export interface IBuffAttribute {
  key: IBonusBuffAttributesKeys;
  value: number;
}

abstract class BaseStatusAction extends BaseAction {
  public abstract get interval(): number;

  public get media() {
    return Assets[this.id as any as keyof typeof Assets];
  }

  abstract readonly timer: Timer;

  public abstract execute(person: Person): IExecuteActionDispose | void;

  public abstract abort(): void;

  public abstract get values(): Array<IBuffAttribute>;
}

export abstract class BaseBuffAction extends BaseStatusAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseBuffAction');

  public readonly mode = ActionMode.Buff;
}

export abstract class BaseDebuffAction extends BaseStatusAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseDebuffAction');

  public readonly mode = ActionMode.Debuff;
}
