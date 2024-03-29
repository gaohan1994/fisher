import { ActionId, ActionMode } from './Constants.js';
import {
  BaseAction,
  BaseAttackAction,
  BaseBuffAction,
  BaseDebuffAction,
  BaseDotAction,
  BaseHealAction,
} from './BaseAction.js';
import {
  NormalAttackAction,
  CritAttackAction,
  LowFixedDamageAction,
  HighFixedDamageAction,
  LowBatterAction,
  HighBatterAction,
} from './AttackActions.js';
import { PosionDotAction, DragonSwordAction } from './DotActions.js';
import { LowHealAction, HighHealAction } from './HealActions.js';
import {
  LowBuffAttackPowerAction,
  LowBuffAttackPowerMultiplierAction,
  LowBuffDefenceCorruptionAction,
  LowBuffDefencePowerAction,
  LowBuffDefencePowerMultiplierAction,
} from './BuffActions.js';
import { LowDebuffAttackPowerAction } from './DebuffActions.js';

type FisherAction = BaseAttackAction | BaseDotAction | BaseHealAction | BaseBuffAction | BaseDebuffAction;

class FisherActions {
  public static readonly ActionId = ActionId;

  public static isAttackAction = (action: BaseAction): action is BaseAttackAction => {
    return action.mode === ActionMode.Attack;
  };

  public static isDotAction = (action: BaseAction): action is BaseDotAction => {
    return action.mode === ActionMode.Dot;
  };

  public static isHealAction = (action: BaseAction): action is BaseHealAction => {
    return action.mode === ActionMode.Heal;
  };

  public static isBuffAction = (action: BaseAction): action is BaseBuffAction => {
    return action.mode === ActionMode.Buff;
  };

  public static isDebuffAction = (action: BaseAction): action is BaseDebuffAction => {
    return action.mode === ActionMode.Debuff;
  };

  /**
   * Attack actions
   *
   * NormalAttackAction is default attack action
   * Every person should have NormalAttackAction and CritAttackAction
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly NormalAttackAction = NormalAttackAction;

  public static readonly CritAttackAction = CritAttackAction;

  public static readonly LowFixedDamageAction = LowFixedDamageAction;

  public static readonly HighFixedDamageAction = HighFixedDamageAction;

  public static readonly LowBatterAction = LowBatterAction;

  public static readonly HighBatterAction = HighBatterAction;

  /**
   * Dot actions
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly PosionDotAction = PosionDotAction;

  public static readonly DragonSwordAction = DragonSwordAction;

  /**
   * Heal actions
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly LowHealAction = LowHealAction;

  public static readonly HighHealAction = HighHealAction;

  /**
   * Buff actions
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly LowBuffAttackPowerAction = LowBuffAttackPowerAction;

  public static readonly LowBuffDefenceCorruptionAction = LowBuffDefenceCorruptionAction;

  public static readonly LowBuffDefencePowerAction = LowBuffDefencePowerAction;

  public static readonly LowBuffDefencePowerMultiplierAction = LowBuffDefencePowerMultiplierAction;

  public static readonly LowBuffAttackPowerMultiplierAction = LowBuffAttackPowerMultiplierAction;

  /**
   * Debuff actions
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly LowDebuffAttackPowerAction = LowDebuffAttackPowerAction;
}

export { ActionId, FisherActions, BaseAttackAction, BaseDotAction, BaseHealAction, BaseBuffAction, BaseDebuffAction };
export type { FisherAction };
