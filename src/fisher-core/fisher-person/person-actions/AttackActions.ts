import { action, makeObservable, observable } from 'mobx';
import { FisherProgressTimer as FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';
import { ActionMode, BaseAction } from './BaseActions';

export class NormalAttackAction extends BaseAction {
  public readonly id = 'NormalAttackAction';

  public readonly name = '普通攻击';

  public readonly mode = ActionMode.Attack;

  @observable
  public readonly timer = new FisherTimer(this.id, () => this.action(), {
    once: true,
  });

  constructor(person: FisherPerson) {
    super(person);
    makeObservable(this);
  }

  @action
  private action = () => {
    if (!this.person.target) return;
    this.person.target.hurt(this.person.attributePanel.AttackDamage);
  };

  @action
  public execute() {
    this.timer.startTimer(this.person.attributePanel.AttackSpeed);
    return void 0;
  }
}
