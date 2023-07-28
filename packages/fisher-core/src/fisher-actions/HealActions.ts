import { Person } from '@person';
import { BaseHealAction } from './BaseAction';
import { ActionId } from './Constants';

class LowHealAction extends BaseHealAction {
  public hpThreshold = 0.7;

  public static readonly LowHealActionMultiplier = 0.25;

  public readonly chance = 20;

  public readonly id = ActionId.LowHealAction;

  public readonly name = '简单包扎';

  public readonly desc = '回复自身25%血量';

  public execute = (person: Person) => {
    person.heal(person.attributePanel.BaseMaxHp * LowHealAction.LowHealActionMultiplier);
  };
}

class HighHealAction extends BaseHealAction {
  public hpThreshold = 0.1;

  public static readonly HighHealActionMultiplier = 0.75;

  public readonly chance = 20;

  public readonly id = ActionId.HighHealAction;

  public readonly name = '上级治疗术';

  public readonly desc = '回复自身75%血量';

  public execute = (person: Person) => {
    person.heal(person.attributePanel.BaseMaxHp * HighHealAction.HighHealActionMultiplier);
  };
}

export { LowHealAction, HighHealAction };
