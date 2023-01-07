import { Person } from '../fisher-person';
import { BaseAttackAction } from './BaseAction';

export class NormalAttackAction extends BaseAttackAction {
  public readonly id = 'NormalAttackAction';

  public readonly name = '普通攻击';

  public execute(person: Person) {
    if (!person.target) return Person.logger.error(`Try to execute ${this.id} but target was undefined`);
    person.target.hurtRange(person.attributePanel.AttackDamage);
  }
}

export class CritAttackAction extends BaseAttackAction {
  public static readonly CritAttackMultiplier = 2;

  public readonly change = 20;

  public readonly id = 'CritAttackAction';

  public readonly name = '暴击';

  public execute(person: Person) {
    if (!person.target) return Person.logger.error(`Try to execute ${this.id} but target was undefined`);
    person.target.hurtRange(CritAttackAction.CritAttackMultiplier * person.attributePanel.AttackDamage);
  }
}
