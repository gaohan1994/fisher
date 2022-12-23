import { FisherProgressTimer as FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';

export enum ActionMode {
  Attack = 'Attack',
}

interface IBaseAction {
  readonly id: string;

  readonly mode: ActionMode;

  timer: FisherTimer;

  name: string;
}

interface IExecuteActionDispose {
  (): void;
}

export abstract class BaseAction implements IBaseAction {
  abstract readonly id: string;

  abstract readonly mode: ActionMode;

  abstract readonly timer: FisherTimer;

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
