import { IAttributeKeys } from '@person';
import { BaseDebuffAction, IBuffAttribute } from './BaseAction';
import { ActionId } from './Constants';

class LowDebuffAttackPowerAction extends BaseDebuffAction {
  public static readonly AttackPower = -15;

  public static readonly Interval = 10 * 1000;

  public readonly id = ActionId.LowDebuffAttackPowerAction;

  public readonly name = '破胆';

  public readonly desc = '使目标攻击力-15';

  public readonly chance = 10;

  public get interval(): number {
    return LowDebuffAttackPowerAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [{ key: IAttributeKeys.AttackPower, value: LowDebuffAttackPowerAction.AttackPower }];
  }
}

export { LowDebuffAttackPowerAction };
