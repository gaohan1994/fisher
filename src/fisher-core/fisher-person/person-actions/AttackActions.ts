import { action, makeObservable } from 'mobx';
import { Person } from '../Person';
import { ActionMode, BaseAction } from './BaseActions';

export class NormalAttackAction extends BaseAction {
  public readonly id = 'NormalAttackAction';

  public readonly name = '普通攻击';

  public readonly mode = ActionMode.Attack;

  constructor(person: Person) {
    super(person);
    makeObservable(this);
  }

  @action
  public execute() {
    if (!this.person.target) return;
    this.person.target.hurtRange(this.person.attributePanel.AttackDamage);
    return void 0;
  }
}
