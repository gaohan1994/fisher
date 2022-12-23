import { FisherProgressTimer as FisherTimer } from '../../fisher-timer';
import { FisherPerson } from '../FisherPerson';
import { ActionMode, BaseAction } from './BaseActions';

export class NormalAttackAction extends BaseAction {
  public readonly id = 'NormalAttackAction';

  public readonly name = '普通攻击';

  public readonly mode = ActionMode.Attack;

  public readonly timer = new FisherTimer({ id: this.id });

  constructor(person: FisherPerson) {
    super(person);
  }

  public execute() {
    const action = () => {
      if (!this.person.target) return;
      this.person.target.hurt(this.person.attributePanel.AttackDamage);
    };
    this.timer
      .setAction(action)
      .startTimer(this.person.attributePanel.AttackSpeed);
    return () => this.timer.stopTimer();
  }
}
