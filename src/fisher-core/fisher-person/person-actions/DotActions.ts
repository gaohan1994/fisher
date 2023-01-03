import { action, computed, makeObservable, observable } from 'mobx';
import { FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';
import { DotAction } from './BaseActions';

export class PersonStateDotAction extends DotAction {
  public override readonly id = 'PersonStateDotAction';

  public name = '内功气劲';

  public chance = 30;

  public totalEffectiveTimes = 5;

  @observable
  public effectiveTimes = 0;

  @observable
  public timer: FisherTimer = new FisherTimer(this.id, () => this.action());

  @computed
  public get effectiveInterval() {
    return 500;
  }

  @computed
  public get isFinished() {
    return this.effectiveTimes >= this.totalEffectiveTimes;
  }

  constructor(person: FisherPerson) {
    super(person);
    makeObservable(this);
  }

  @action
  public damage = (): number => {
    return this.person.attributePanel.BaseAttackPower;
  };

  @action
  public application = () => {
    this.resetDot();
  };

  @action
  public effective = () => {
    this.timer.startTimer(this.effectiveInterval);
  };

  @action
  public abort = () => {
    this.timer.stopTimer();
  };

  @action
  private action = () => {
    if (this.person.target === undefined)
      return FisherPerson.logger.error(
        'Try to effective dot to undefined target'
      );

    if (this.isFinished) {
      FisherPerson.logger.debug(`Current Dot ${this.id} finished. clear dot`);
      this.person.target.actionManager.deleteDot(this.id);
      return this.timer.stopTimer();
    }

    this.effectiveTimes += 1;
    this.person.target.hurt(this.damage());
  };

  @action
  public resetDot = () => {
    this.effectiveTimes = 0;
  };
}
