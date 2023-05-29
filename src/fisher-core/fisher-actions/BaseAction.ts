import numeral from 'numeral';
import { prefixes, prefixLogger } from '@FisherLogger';
import { Timer } from '../fisher-timer';
import { IBonusBuffAttributesKeys, Person } from '../fisher-person';
import { Assets } from '../assets';
import { ActionId, ActionMode } from './Constants';
import { FisherActionError } from '../fisher-error';

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

  abstract execute(person: Person): IExecuteActionDispose | void;

  abstract desc: string;
}

export abstract class BaseAttackAction extends BaseAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseAttackAction');

  public readonly mode = ActionMode.Attack;
}

export abstract class BaseHealAction extends BaseAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseHealAction');

  public readonly mode = ActionMode.Heal;

  abstract hpThreshold: number;

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

  public abstract abort(): void;

  public abstract get values(): Array<IBuffAttribute>;

  public person: Person | undefined;

  public readonly timer = new Timer('StatucActionTimer', () => this.action(), { showProgress: true });

  private action = (): void => {
    this.abort();
    BaseBuffAction.logger.debug(`Current action ${this.id} ${this.name} finished. clear action`);
  };
}

export abstract class BaseBuffAction extends BaseStatusAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseBuffAction');

  public readonly mode = ActionMode.Buff;

  public execute = (person: Person): void => {
    this.person = person;
    this.timer.startTimer(this.interval);
    this.person.actionManager.deployBuffAction(this);
  };

  public abort = (): void => {
    if (this.person === undefined) {
      throw new FisherActionError(`Try abort action ${this.id} on a undefined person`);
    }

    this.timer.stopTimer();
    this.person.actionManager.undeployBuffAction(this.id);
  };
}

export abstract class BaseDebuffAction extends BaseStatusAction {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'BaseDebuffAction');

  public readonly mode = ActionMode.Debuff;

  public execute = (person: Person): void => {
    this.person = person;
    this.timer.startTimer(this.interval);
    this.person.actionManager.deployDebuffAction(this);
  };

  public abort = (): void => {
    if (this.person === undefined) {
      throw new FisherActionError(`Try abort action ${this.id} on a undefined person`);
    }

    this.timer.stopTimer();
    this.person.actionManager.undeployDebuffAction(this.id);
  };
}
