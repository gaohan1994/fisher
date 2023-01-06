import { Timer } from '../../fisher-timer';
import { Person } from '../Person';

export enum ActionMode {
  Attack = 'Attack',
  Dot = 'Dot',
}

interface IBaseAction {
  readonly id: string;

  readonly mode: ActionMode;

  name: string;
}

export interface IExecuteActionDispose {
  (): void;
}

export abstract class BaseAction implements IBaseAction {
  abstract readonly id: string;

  abstract readonly mode: ActionMode;

  public person: Person;

  public name = '';

  constructor(person: Person) {
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

  abstract readonly timer: Timer;

  public get effectiveInterval() {
    return 0;
  }

  public get isFinished() {
    return false;
  }

  /**
   * 初始化 dot
   */
  abstract initialize(): void;

  /**
   * 生效 dot
   */
  abstract effective(): void;

  /**
   * 中止 dot
   */
  abstract abort(): void;

  public damage(): number {
    throw new Error('Not implemented!');
  }
}
