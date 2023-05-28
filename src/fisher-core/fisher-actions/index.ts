import { makeAutoObservable } from 'mobx';
import { ActionId, ActionMode } from './Constants';
import { FisherActionError } from '../fisher-error';
import {
  BaseAction,
  BaseAttackAction,
  BaseBuffAction,
  BaseDebuffAction,
  BaseDotAction,
  BaseHealAction,
} from './BaseAction';
import {
  NormalAttackAction,
  CritAttackAction,
  LowFixedDamageAction,
  HighFixedDamageAction,
  LowBatterAction,
  HighBatterAction,
} from './AttackActions';
import { PosionDotAction } from './DotActions';
import { LowHealAction, HighHealAction } from './HealActions';
import { LowBuffAttackPowerAction } from './BuffActions';
import { LowDebuffAttackPowerAction } from './DebuffActions';

type FisherAction = BaseAttackAction | BaseDotAction | BaseHealAction | BaseBuffAction | BaseDebuffAction;

class FisherActions {
  public static instance: FisherActions;

  public static create(): FisherActions {
    if (!FisherActions.instance) {
      FisherActions.instance = new FisherActions();
    }
    return FisherActions.instance;
  }

  public static readonly ActionId = ActionId;

  /**
   * NormalAttackAction is default attack action
   * Every person should have NormalAttackAction and CritAttackAction
   * So set static method
   *
   * @author Harper.Gao
   * @static
   * @memberof FisherActions
   */
  public static readonly NormalAttackAction = NormalAttackAction;

  public static readonly CritAttackAction = CritAttackAction;

  private attackActionMap = new Map<ActionId, BaseAction>();

  private dotActionMap = new Map<ActionId, BaseDotAction>();

  private healActionMap = new Map<ActionId, BaseAction>();

  private get actions() {
    return [...this.attackActionMap.values(), ...this.dotActionMap.values(), ...this.healActionMap.values()];
  }

  private constructor() {
    makeAutoObservable(this);

    // registe attack action, dot action and heal actions
    this.attackActionMap.set(ActionId.NormalAttackAction, new NormalAttackAction());
    this.attackActionMap.set(ActionId.CritAttackAction, new CritAttackAction());
    this.attackActionMap.set(ActionId.LowFixedDamageAction, new LowFixedDamageAction());
    this.attackActionMap.set(ActionId.HighFixedDamageAction, new HighFixedDamageAction());
    this.attackActionMap.set(ActionId.LowBatterAction, new LowBatterAction());
    this.attackActionMap.set(ActionId.HighBatterAction, new HighBatterAction());

    this.dotActionMap.set(ActionId.PosionDotAction, new PosionDotAction());

    this.healActionMap.set(ActionId.LowHealAction, new LowHealAction());
    this.healActionMap.set(ActionId.HighHealAction, new HighHealAction());
  }

  public findActionById = <T = BaseAction>(id: ActionId): T => {
    const result = this.actions.find((action) => action.id === id);

    if (result === undefined) {
      throw new FisherActionError(`Can not find action by id: ${id}`);
    }

    return result as T;
  };

  public findAttackActionById = <T = BaseAction>(id: ActionId): T => {
    const result = this.attackActionMap.get(id);

    if (result === undefined) {
      throw new FisherActionError(`Can not find attack action by id: ${id}`);
    }

    return result as T;
  };

  public findDotActionById = <T = BaseAction>(id: ActionId): T => {
    const result = this.dotActionMap.get(id);

    if (result === undefined) {
      throw new FisherActionError(`Can not find dot action by id: ${id}`);
    }

    return result as T;
  };

  public findHealActionById = <T = BaseAction>(id: ActionId): T => {
    const result = this.healActionMap.get(id);

    if (result === undefined) {
      throw new FisherActionError(`Can not find heal action by id: ${id}`);
    }

    return result as T;
  };
}

const fisherActions = FisherActions.create();

function isAttackAction(action: BaseAction): action is BaseAttackAction {
  return action.mode === ActionMode.Attack;
}

function isDotAction(action: BaseAction): action is BaseDotAction {
  return action.mode === ActionMode.Dot;
}

function isHealAction(action: BaseAction): action is BaseHealAction {
  return action.mode === ActionMode.Heal;
}

export {
  fisherActions,
  FisherActions,
  ActionId,
  BaseAttackAction,
  BaseDotAction,
  BaseHealAction,
  BaseBuffAction,
  BaseDebuffAction,
  isAttackAction,
  isDotAction,
  isHealAction,
  NormalAttackAction,
  CritAttackAction,
  LowFixedDamageAction,
  HighFixedDamageAction,
  LowBatterAction,
  HighBatterAction,
  PosionDotAction,
  LowHealAction,
  HighHealAction,
  LowBuffAttackPowerAction,
  LowDebuffAttackPowerAction,
};
export type { FisherAction };
