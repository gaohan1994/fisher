import { prefixes, prefixLogger } from '@FisherLogger';
import { Timer } from '../fisher-timer';
import { Person } from '../fisher-person';
import { Assets } from '../assets';
import { ActionMode } from './Constants';
import numeral from 'numeral';

interface IBaseAction {
  readonly id: string;

  readonly mode: ActionMode;

  readonly name: string;
}

export interface IExecuteActionDispose {
  (): void;
}

export abstract class BaseAction implements IBaseAction {
  abstract readonly id: string;

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
    return Assets[this.id as keyof typeof Assets];
  }

  abstract readonly timer: Timer;

  /**
   * 初始化 dot
   */
  abstract initialize(person: Person): void;

  /**
   * 生效 dot
   */
  abstract effective(): void;

  /**
   * 中止 dot
   */
  abstract abort(): void;

  /**
   * dot 伤害
   */
  abstract damage(): number;
}
