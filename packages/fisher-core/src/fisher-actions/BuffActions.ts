import { IAttributeKeys } from '@person';
import { BaseBuffAction, IBuffAttribute } from './BaseAction';
import { ActionId } from './Constants';

class LowBuffAttackPowerAction extends BaseBuffAction {
  public static readonly AttackPower = 20;

  public static readonly Interval = 30 * 1000;

  public readonly id = ActionId.LowBuffAttackPowerAction;

  public readonly name = '勇气';

  public readonly desc = '攻击力+20';

  public readonly chance = 10;

  public get interval(): number {
    return LowBuffAttackPowerAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [{ key: IAttributeKeys.AttackPower, value: LowBuffAttackPowerAction.AttackPower }];
  }
}

class LowBuffAttackPowerMultiplierAction extends BaseBuffAction {
  public static readonly AttackPowerMultiplier = 0.8;

  public static readonly DefencePowerMultiplier = -0.4;

  public static readonly Interval = 30 * 1000;

  public readonly id = ActionId.LowBuffAttackPowerMultiplierAction;

  public readonly name = '太一';

  public readonly desc = '攻击力大幅提升，攻击力提升80%，防御降低40%';

  public readonly chance = 30;

  public get interval(): number {
    return LowBuffAttackPowerMultiplierAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [
      { key: IAttributeKeys.AttackPowerMultiplier, value: LowBuffAttackPowerMultiplierAction.AttackPowerMultiplier },
      { key: IAttributeKeys.DefencePowerMultiplier, value: LowBuffAttackPowerMultiplierAction.DefencePowerMultiplier },
    ];
  }
}

class LowBuffDefencePowerAction extends BaseBuffAction {
  public static readonly DefencePower = 10;

  public static readonly Interval = 10 * 1000;

  public readonly id = ActionId.LowBuffDefencePowerAction;

  public readonly name = '聚神';

  public readonly desc = '防御力提升10点';

  public readonly chance = 30;

  public get interval(): number {
    return LowBuffDefencePowerAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [{ key: IAttributeKeys.DefencePower, value: LowBuffDefencePowerAction.DefencePower }];
  }
}

class LowBuffDefencePowerMultiplierAction extends BaseBuffAction {
  public static readonly DefencePowerMultiplier = 0.2;

  public static readonly Interval = 10 * 1000;

  public readonly id = ActionId.LowBuffDefencePowerMultiplierAction;

  public readonly name = '坚守';

  public readonly desc = '防御力提升20%';

  public readonly chance = 30;

  public get interval(): number {
    return LowBuffDefencePowerMultiplierAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [
      { key: IAttributeKeys.DefencePowerMultiplier, value: LowBuffDefencePowerMultiplierAction.DefencePowerMultiplier },
    ];
  }
}

class LowBuffDefenceCorruptionAction extends BaseBuffAction {
  public static readonly AttackPower = 40;

  public static readonly DefenceCorruption = 8;

  public static readonly Interval = 30 * 1000;

  public readonly id = ActionId.LowBuffDefenceCorruptionAction;

  public readonly name = '暗袭';

  public readonly desc = '增加40点攻击，减少目标8点防御';

  public readonly chance = 30;

  public get interval(): number {
    return LowBuffDefenceCorruptionAction.Interval;
  }

  public get values(): IBuffAttribute[] {
    return [
      { key: IAttributeKeys.AttackPower, value: LowBuffDefenceCorruptionAction.AttackPower },
      { key: IAttributeKeys.DefenceCorruption, value: LowBuffDefenceCorruptionAction.DefenceCorruption },
    ];
  }
}

export {
  LowBuffAttackPowerAction,
  LowBuffAttackPowerMultiplierAction,
  LowBuffDefencePowerAction,
  LowBuffDefencePowerMultiplierAction,
  LowBuffDefenceCorruptionAction,
};
