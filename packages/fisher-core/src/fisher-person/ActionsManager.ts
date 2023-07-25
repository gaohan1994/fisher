import { makeAutoObservable } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixes, prefixLogger } from '@fisher/logger';
import {
  ActionId,
  BaseAttackAction,
  BaseDotAction,
  BaseHealAction,
  BaseBuffAction,
  FisherActions,
  BaseDebuffAction,
} from '../fisher-actions';
import type { FisherAction } from '../fisher-actions';
import { Timer } from '../fisher-timer';
import { getRecordTime, roll } from '../utils';
import { Person } from './Person';

namespace IActionManager {
  export enum ActionManagerEventKeys {
    ExecuteAction = 'ExecuteAction',
  }

  export interface ExecuteActionPayload {
    person: Person;
    action: FisherAction;
    lastAction: FisherAction | undefined;
    time: string;
  }
}

class ActionManager {
  public static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  public static readonly ActionManagerEventKeys = IActionManager.ActionManagerEventKeys;

  public readonly event = new EventEmitter();

  private person: Person;

  public readonly normalAttackAction = new FisherActions.NormalAttackAction();

  public readonly critAttackAction = new FisherActions.CritAttackAction();

  private lastAction: FisherAction | undefined = undefined;

  private action: FisherAction = this.normalAttackAction;

  private attackActionMap = new Map<ActionId, BaseAttackAction>();

  public get attackActions() {
    return [...this.attackActionMap.values()];
  }

  private dotActionMap = new Map<ActionId, BaseDotAction>();

  public get dotActions() {
    return [...this.dotActionMap.values()];
  }

  private healActionMap = new Map<ActionId, BaseHealAction>();

  public get healActions() {
    return [...this.healActionMap.values()];
  }

  private activeDotActionMap = new Map<ActionId, BaseDotAction>();

  public get activeDotActions() {
    return [...this.activeDotActionMap.values()];
  }

  private buffActionMap = new Map<ActionId, BaseBuffAction>();

  public get buffActions() {
    return [...this.buffActionMap.values()];
  }

  private activeBuffActionMap = new Map<ActionId, BaseBuffAction>();

  public get activeBuffActions() {
    return [...this.activeBuffActionMap.values()];
  }

  private debuffActionMap = new Map<ActionId, BaseDebuffAction>();

  public get debuffActions() {
    return [...this.debuffActionMap.values()];
  }

  private activeDebuffActionMap = new Map<ActionId, BaseDebuffAction>();

  public get activeDebuffActions() {
    return [...this.activeDebuffActionMap.values()];
  }

  public attackActionTimer = new Timer('AttackActionTimer', () => this.attackActionHandler(), { showProgress: true });

  constructor(person: Person, actionIds: ActionId[]) {
    makeAutoObservable(this);

    this.person = person;
    this.registerActions(actionIds);
  }

  /**
   * Registe current person all available actions
   * - attack actions
   * - dot actions
   * - heal actions
   */
  public registerActions = (actionIds: ActionId[]) => {
    /**
     * Note: clear action map before set actions
     * some time we will re-registe person actions
     */
    this.clearActionMap();

    actionIds.forEach((actionId) => {
      const action = new FisherActions[actionId]();

      if (FisherActions.isAttackAction(action)) {
        this.attackActionMap.set(actionId, action);
      }

      if (FisherActions.isDotAction(action)) {
        this.dotActionMap.set(actionId, action);
      }

      if (FisherActions.isHealAction(action)) {
        this.healActionMap.set(actionId, action);
      }

      if (FisherActions.isBuffAction(action)) {
        this.buffActionMap.set(actionId, action);
      }

      if (FisherActions.isDebuffAction(action)) {
        this.debuffActionMap.set(actionId, action);
      }
    });

    ActionManager.logger.info(`Success register person actions, actionIds: ${actionIds.join(' , ')}`);
  };

  private clearActionMap = () => {
    this.attackActionMap.clear();
    this.dotActionMap.clear();
    this.healActionMap.clear();
    this.buffActionMap.clear();
    this.debuffActionMap.clear();
  };

  public startAttacking = () => {
    this.attackActionTimer.startTimer(this.person.attributePanel.AttackSpeed);
  };

  public stopAttacking = () => {
    this.action = this.normalAttackAction;
    this.attackActionTimer.stopTimer();
  };

  public resetAttackActionProgress = () => {
    this.attackActionTimer.resetProgress();
  };

  public clearActionsEffects = () => {
    this.activeDotActionMap.forEach((action) => action.abort());
    this.activeDotActionMap.clear();

    this.activeBuffActionMap.forEach((action) => action.abort());
    this.activeBuffActionMap.clear();

    this.activeDebuffActionMap.forEach((action) => action.abort());
    this.activeDebuffActionMap.clear();

    ActionManager.logger.info(`Clear all actions effect!`);
  };

  public deployDotAction = (action: BaseDotAction) => {
    this.activeDotActionMap.set(action.id, action);

    ActionManager.logger.debug(`Dot action ${action.id} deployed in ${this.person.mode}`);
  };

  public undeployDotAction = (actionId: ActionId) => {
    this.activeDotActionMap.delete(actionId);

    ActionManager.logger.debug(`Action ${actionId} deleted in ${this.person.mode}`);
  };

  public deployBuffAction = (action: BaseBuffAction) => {
    this.activeBuffActionMap.set(action.id, action);

    ActionManager.logger.debug(`${action.mode} Action ${action.id} deployed in ${this.person.mode}`);
  };

  public undeployBuffAction = (actionId: ActionId) => {
    this.activeBuffActionMap.delete(actionId);

    ActionManager.logger.debug(`Action ${actionId} undeployed in ${this.person.mode}`);
  };

  public deployDebuffAction = (action: BaseDebuffAction) => {
    this.activeDebuffActionMap.set(action.id, action);

    ActionManager.logger.debug(`${action.mode} Action ${action.id} deployed in ${this.person.mode}`);
  };

  public undeployDebuffAction = (actionId: ActionId) => {
    this.activeDebuffActionMap.delete(actionId);

    ActionManager.logger.debug(`Action ${actionId} undeployed in ${this.person.mode}`);
  };

  public attackActionHandler = () => {
    this.event.emit(ActionManager.ActionManagerEventKeys.ExecuteAction, {
      person: this.person,
      action: this.action,
      lastAction: this.lastAction,
      time: getRecordTime(),
    } as IActionManager.ExecuteActionPayload);

    this.action.execute(this.person);

    ActionManager.logger.debug(
      `Person ${this.person.mode} execute ${this.action.id}, the last action: ${
        this.lastAction ? this.lastAction.id : 'null'
      }`
    );

    if (this.person.isAttacking) {
      this.lastAction = this.action;
      this.action = this.pickNextAction();
    }
  };

  private pickNextAction = (): FisherAction => {
    let result: FisherAction = this.normalAttackAction;

    const critAction = this.pickCritAction();
    if (critAction) result = critAction;

    const attackAction = this.pickAttackAction();
    if (attackAction) result = attackAction;

    const dotAction = this.pickDotAction();
    if (dotAction) result = dotAction;

    const buffAction = this.pickBuffAction();
    if (buffAction) result = buffAction;

    const debuffAction = this.pickDebuffAction();
    if (debuffAction) result = debuffAction;

    const healAction = this.pickHealAction();
    if (healAction) result = healAction;

    ActionManager.logger.info(`${this.person.mode} next action: ${result.name}`);

    return result;
  };

  private pickCritAction = (): BaseAttackAction | undefined => {
    let result: BaseAttackAction | undefined = undefined;

    if (roll(this.critAttackAction.chance)) {
      result = this.critAttackAction;
    }

    return result;
  };

  private pickAttackAction = () => {
    let result: BaseAttackAction | undefined = undefined;

    for (let index = 0; index < this.attackActions.length; index++) {
      const action = this.attackActions[index];

      if (roll(action.chance)) {
        result = action;
        break;
      }
    }

    return result;
  };

  private pickDotAction = (): BaseDotAction | undefined => {
    let result: BaseDotAction | undefined = undefined;

    for (let index = 0; index < this.dotActions.length; index++) {
      const dotAction = this.dotActions[index];

      if (roll(dotAction.chance) && !this.checkDotActionIsExistInTarget(dotAction)) {
        result = dotAction;
        break;
      }
    }

    return result;
  };

  private pickBuffAction = () => {
    let result: BaseBuffAction | undefined = undefined;

    for (let index = 0; index < this.buffActions.length; index++) {
      const action = this.buffActions[index];

      if (roll(action.chance) && !this.checkBuffActionIsExistInTarget(action)) {
        result = action;
        break;
      }
    }

    return result;
  };

  private pickDebuffAction = () => {
    let result: BaseDebuffAction | undefined = undefined;

    for (let index = 0; index < this.debuffActions.length; index++) {
      const action = this.debuffActions[index];

      if (roll(action.chance) && this.checkDeBuffActionIsExistInTarget(action)) {
        result = action;
        break;
      }
    }

    return result;
  };

  private pickHealAction = () => {
    let result: BaseHealAction | undefined = undefined;

    for (let index = 0; index < this.healActions.length; index++) {
      const action = this.healActions[index];

      if (roll(action.chance) && !this.checkIsLastAction(action) && action.checkHpThreshold(this.person)) {
        result = action;
        break;
      }
    }

    return result;
  };

  private checkIsLastAction = (action: FisherAction) => {
    return this.lastAction?.id === action.id;
  };

  private checkBuffActionIsExistInTarget = (action: BaseBuffAction) => {
    if (this.person.target === undefined)
      return ActionManager.logger.error('Try check action is exist but target undefined');

    return this.activeBuffActionMap.has(action.id);
  };

  private checkDeBuffActionIsExistInTarget = (action: BaseDebuffAction) => {
    if (this.person.target === undefined)
      return ActionManager.logger.error('Try check action is exist but target undefined');

    return this.person.target.actionManager.activeDebuffActionMap.has(action.id);
  };

  private checkDotActionIsExistInTarget = (action: BaseDotAction) => {
    if (this.person.target === undefined)
      return ActionManager.logger.error('Try check action is exist but target undefined');

    return this.person.target.actionManager.activeDotActionMap.has(action.id);
  };
}

export { ActionManager, IActionManager };
