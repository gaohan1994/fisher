import { action, computed, makeObservable, observable } from 'mobx';
import { FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';
import { DotAction } from './BaseActions';

// 尝试不传入 dotInfo 而是全部写死在类里
export class PersonStateDotAction extends DotAction {
  public override readonly id = 'PersonStateDotAction';

  public name = '内功气劲';

  public chance = 50;

  public totalEffectiveTimes = 5;

  @observable
  public effectiveTimes = 0;

  @observable
  public timer: FisherTimer = new FisherTimer(this.id, () => this.action());

  @observable
  public override person: FisherPerson;

  @observable
  public target: FisherPerson | undefined;

  @computed
  public get effectiveInterval() {
    return 2000;
  }

  @computed
  public get isFinished() {
    return this.effectiveTimes >= this.totalEffectiveTimes;
  }

  constructor(person: FisherPerson) {
    super(person);
    makeObservable(this);

    this.person = person;
    this.target = person.target;
  }

  @action
  public damage = (): number => {
    return this.person.attributePanel.BaseAttackPower;
  };

  @action
  public application = (target?: FisherPerson) => {
    const _target = target ?? this.target;

    if (!_target)
      return FisherPerson.logger.error(
        'Try to application dot to undefined target'
      );

    this.target = _target;
    this.target.actionManager.activeDotMap.set(this.id, this);
  };

  @action
  public effective() {
    this.timer.startTimer(this.effectiveInterval);
    return () => this.timer.stopTimer();
  }

  @action
  private action = () => {
    if (this.isFinished) {
      FisherPerson.logger.debug(`Current Dot ${this.id} finished!`);
      return this.timer.stopTimer();
    }

    if (this.target === undefined)
      return FisherPerson.logger.error(
        'Try to effective dot to undefined target'
      );

    this.effectiveTimes += 1;
    this.target.hurt(this.damage());
  };
}
