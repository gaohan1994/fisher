import { FisherActionError } from '../fisher-error';
import { Person } from '../fisher-person';
import { Timer } from '../fisher-timer';
import { BaseDotAction, IExecuteActionDispose } from './BaseAction';
import { ActionId } from './Constants';

class PosionDotAction extends BaseDotAction {
  public override readonly id = ActionId.PosionDotAction;

  public readonly name = '剧毒';

  public readonly chance = 30;

  public readonly totalEffectiveTimes = 5;

  public readonly desc = '对目标造成持续毒攻击';

  public effectiveTimes = 0;

  public readonly timer: Timer = new Timer(this.id, () => this.action(), { fireImmediately: true });

  private person: Person | undefined = undefined;

  public get interval() {
    return 1000;
  }

  public execute = (person: Person): void | IExecuteActionDispose => {
    this.person = person;
    this.resetDot();
    this.timer.startTimer(this.interval);
  };

  public abort = () => {
    this.timer.stopTimer();
  };

  public damage = () => {
    this.checkPersonIsAvailable();
    return this.person!.attributePanel.AttackDamage / 4 + this.person!.experience.level;
  };

  private action = () => {
    this.checkPersonIsAvailable();
    if (this.person!.target === undefined) {
      throw new FisherActionError(`Try to effective dot to undefined target`, '没有目标');
    }

    this.effectiveTimes += 1;
    this.person!.target.hurt(this.damage());

    if (this.isFinished) {
      this.abort();
      this.person!.target.actionManager.undeployDotAction(this.id);

      BaseDotAction.logger.debug(`Current action ${this.id} ${this.name} finished.`);
    }
  };

  public resetDot = () => {
    this.effectiveTimes = 0;
  };

  private checkPersonIsAvailable = () => {
    if (this.person === undefined) {
      throw new FisherActionError(`Try to run ${this.id} but person was undefined!`, '没有目标');
    }
  };
}

class DragonSwordAction extends BaseDotAction {
  public static readonly Interval = 500;

  public override readonly id = ActionId.DragonSwordAction;

  public readonly chance = 30;

  public readonly totalEffectiveTimes = 3;

  public readonly name = '斩龙剑气';

  public readonly desc = '有概率发动斩龙剑气，对目标持续造成伤害';

  public effectiveTimes = 0;

  public readonly timer: Timer = new Timer(this.id, () => this.action(), { fireImmediately: true });

  private person: Person | undefined = undefined;

  public get interval() {
    return DragonSwordAction.Interval;
  }

  public execute = (person: Person): void | IExecuteActionDispose => {
    this.person = person;
    this.resetDot();
    this.timer.startTimer(this.interval);
  };

  public abort = () => {
    this.timer.stopTimer();
  };

  public damage = () => {
    this.checkPersonIsAvailable();
    return this.person?.attributePanel.AttackDamage!;
  };

  private action = () => {
    this.checkPersonIsAvailable();
    if (this.person!.target === undefined) {
      throw new FisherActionError(`Try to effective dot to undefined target`, '没有目标');
    }

    this.effectiveTimes += 1;
    this.person!.target.hurt(this.damage());

    if (this.isFinished) {
      this.abort();
      this.person!.target.actionManager.undeployDotAction(this.id);

      BaseDotAction.logger.debug(`Current action ${this.id} ${this.name} finished.`);
    }
  };

  public resetDot = () => {
    this.effectiveTimes = 0;
  };

  private checkPersonIsAvailable = () => {
    if (this.person === undefined) {
      throw new FisherActionError(`Try to run ${this.id} but person was undefined!`, '没有目标');
    }
  };
}
export { PosionDotAction, DragonSwordAction };
