import { Person } from '../fisher-person';
import { BaseAttackAction } from './BaseAction';

export class NormalAttackAction extends BaseAttackAction {
  public readonly id = 'NormalAttackAction';

  public readonly name = '普通攻击';

  public execute(person: Person) {
    if (!person.target) return Person.logger.error('Try to execute NormalAttackAction but target was undefined');

    person.target.hurtRange(person.attributePanel.AttackDamage);
  }
}
