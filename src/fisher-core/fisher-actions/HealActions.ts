import { Person } from '../fisher-person';
import { BaseAttackAction } from './BaseAction';

class LowHealAction extends BaseAttackAction {
  public static readonly LowHealActionMultiplier = 0.25;

  public readonly id = 'LowHealAction';

  public readonly name = '简单包扎';

  public execute = (person: Person) => {
    person.heal(person.attributePanel.BaseMaxHp * LowHealAction.LowHealActionMultiplier);
  };
}

class HighHealAction extends BaseAttackAction {
  public static readonly HighHealActionMultiplier = 0.75;

  public readonly id = 'HighHealAction';

  public readonly name = '上级治疗术';

  public execute = (person: Person) => {
    person.heal(person.attributePanel.BaseMaxHp * HighHealAction.HighHealActionMultiplier);
  };
}

export { LowHealAction, HighHealAction };
