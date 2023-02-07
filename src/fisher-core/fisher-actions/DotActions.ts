import { Person } from '../fisher-person';
import { Timer } from '../fisher-timer';
import { BaseDotAction } from './BaseAction';

export class PosionDotAction extends BaseDotAction {
  public override readonly id = 'posion';

  public name = '剧毒';

  public chance = 30;

  public totalEffectiveTimes = 5;

  public effectiveTimes = 0;

  public timer: Timer = new Timer(this.id, () => this.action(), { fireImmediately: true });

  private person: Person | undefined = undefined;

  public get interval() {
    return 1000;
  }

  public initialize = (person: Person) => {
    this.person = person;
    this.resetDot();
  };

  public effective = () => {
    this.timer.startTimer(this.interval);
  };

  public abort = () => {
    this.timer.stopTimer();
  };

  public damage = () => {
    this.checkPersonIsAvailable();
    return this.person!.attributePanel.BaseAttackPower;
  };

  private action = () => {
    this.checkPersonIsAvailable();
    if (this.person!.target === undefined) {
      BaseDotAction.logger.error('Try to effective dot to undefined target');
      throw new Error('Try to effective dot to undefined target');
    }

    this.effectiveTimes += 1;
    this.person!.target.hurt(this.damage());

    if (this.isFinished) {
      this.person!.target.actionManager.undeployDotAction(this.id);
      BaseDotAction.logger.debug(`Current DotAction ${this.id} ${this.name} finished. clear dotAction`);
      return this.timer.stopTimer();
    }
  };

  public resetDot = () => {
    this.effectiveTimes = 0;
  };

  private checkPersonIsAvailable = () => {
    if (this.person === undefined) {
      BaseDotAction.logger.error(`Try to run ${this.id} but person was undefined!`);
      throw new Error(`Try to run ${this.id} but person was undefined!`);
    }
  };
}
