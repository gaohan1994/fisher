import { action, computed, makeObservable, observable } from 'mobx';
import { Timer } from '../../fisher-timer';
import { Person } from '../Person';
import { DotAction } from './BaseActions';

export class PersonStateDotAction extends DotAction {
  public override readonly id = 'PersonStateDotAction';

  public name = '内功气劲';

  public chance = 30;

  public totalEffectiveTimes = 5;

  @observable
  public effectiveTimes = 0;

  @observable
  public timer: Timer = new Timer(this.id, () => this.action(), {
    fireImmediately: true,
  });

  @computed
  public get effectiveInterval() {
    return 500;
  }

  @computed
  public get isFinished() {
    return this.effectiveTimes >= this.totalEffectiveTimes;
  }

  constructor(person: Person) {
    super(person);
    makeObservable(this);
  }

  @action
  public damage = (): number => {
    return this.person.attributePanel.BaseAttackPower;
  };

  @action
  public initialize = () => {
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
    if (this.person.target === undefined) return Person.logger.error('Try to effective dot to undefined target');

    if (this.isFinished) {
      Person.logger.debug(`Current Dot ${this.id} finished. clear dot`);
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
