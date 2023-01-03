import { FisherProgressTimer, FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';

export enum ActionMode {
  Attack = 'Attack',
  Dot = 'Dot',
}

interface IBaseAction {
  readonly id: string;

  readonly mode: ActionMode;

  timer: FisherTimer | FisherProgressTimer;

  name: string;
}

export interface IExecuteActionDispose {
  (): void;
}

export abstract class BaseAction implements IBaseAction {
  abstract readonly id: string;

  abstract readonly mode: ActionMode;

  abstract readonly timer: FisherTimer | FisherProgressTimer;

  public person: FisherPerson;

  public name = '';

  constructor(person: FisherPerson) {
    this.person = person;
  }

  /**
   * 执行 action
   */
  public execute(): IExecuteActionDispose | undefined {
    throw new Error('Not implemented!');
  }
}

export abstract class DotAction extends BaseAction {
  public readonly mode = ActionMode.Dot;

  public abstract chance: number;

  public abstract effectiveTimes: number;

  public abstract totalEffectiveTimes: number;

  public get effectiveInterval() {
    return 0;
  }

  public get isFinished() {
    return false;
  }

  /**
   * 对 target 应用 dot
   *
   * @param {FisherPerson} target
   * @memberof DotAction
   */
  abstract application(target: FisherPerson): void;
  /**
   * 生效 dot
   *
   * @param {FisherPerson} target
   * @memberof DotAction
   */
  abstract effective(): void;

  /**
   * 中止 dot
   *
   * @abstract
   * @memberof DotAction
   */
  abstract abort(): void;

  public damage(): number {
    throw new Error('Not implemented!');
  }
}
