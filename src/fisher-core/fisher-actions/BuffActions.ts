import { FisherActionError } from '../fisher-error';
import { IAttributeKeys, Person } from '../fisher-person';
import { Timer } from '../fisher-timer';
import { BaseBuffAction, IBuffAttribute } from './BaseAction';
import { ActionId } from './Constants';

class LowBuffAttackPowerAction extends BaseBuffAction {
  public static readonly AttackPower = 20;

  public static readonly Interval = 30 * 1000;

  public readonly id = ActionId.LowBuffAttackPowerAction;

  public readonly name = '勇气';

  public readonly chance = 10;

  private person: Person | undefined = undefined;

  public get interval(): number {
    return LowBuffAttackPowerAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [{ key: IAttributeKeys.AttackPower, value: LowBuffAttackPowerAction.AttackPower }];
  }

  public readonly timer = new Timer('LowBuffAttackPowerActionTimer', () => this.action(), { showProgress: true });

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

  private action = (): void => {
    this.abort();
    BaseBuffAction.logger.debug(`Current action ${this.id} ${this.name} finished. clear action`);
  };
}

export { LowBuffAttackPowerAction };
