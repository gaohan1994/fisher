import { FisherActionError } from '../fisher-error';
import { IAttributeKeys, Person } from '../fisher-person';
import { Timer } from '../fisher-timer';
import { BaseDebuffAction, IBuffAttribute } from './BaseAction';
import { ActionId } from './Constants';

class LowDebuffAttackPowerAction extends BaseDebuffAction {
  public static readonly AttackPower = -15;

  public static readonly Interval = 10 * 1000;

  public readonly id = ActionId.LowDebuffAttackPowerAction;

  public readonly name = '破胆';

  public readonly chance = 10;

  private person: Person | undefined = undefined;

  public get interval(): number {
    return LowDebuffAttackPowerAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [{ key: IAttributeKeys.AttackPower, value: LowDebuffAttackPowerAction.AttackPower }];
  }

  public readonly timer = new Timer('LowDebuffAttackPowerActionTimer', () => this.action(), { showProgress: true });

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

  private action = (): void => {
    this.abort();
    BaseDebuffAction.logger.debug(`Current action ${this.id} ${this.name} finished. clear action`);
  };
}

export { LowDebuffAttackPowerAction };
