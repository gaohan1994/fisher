import { makeAutoObservable } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  ActionId,
  BaseAttackAction,
  BaseDotAction,
  BaseHealAction,
  FisherActions,
  fisherActions,
  isAttackAction,
  isDotAction,
  isHealAction,
} from '../fisher-actions';
import type { FisherAction } from '../fisher-actions';
import { Timer } from '../fisher-timer';
import { roll } from '../utils';
import { Person } from './Person';

namespace IActionManager {
  export enum ActionManagerEventKeys {
    ExecuteAction = 'ExecuteAction',
  }

  export interface ExecuteActionPayload {
    person: Person;
    action: FisherAction;
    lastAction: FisherAction | undefined;
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

  private nextAction: FisherAction = this.normalAttackAction;

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

  private activeDotActionMap = new Map<string, BaseDotAction>();

  public get activeDotActions() {
    return [...this.activeDotActionMap.values()];
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
  private registerActions = (actionIds: ActionId[]) => {
    /**
     * Note: clear action map before set actions
     * some time we will re-registe person actions
     */
    this.clearActionMap();

    actionIds.forEach((actionId) => {
      const action = fisherActions.findActionById(actionId);

      if (isAttackAction(action)) {
        this.attackActionMap.set(actionId, action);
      }

      if (isDotAction(action)) {
        this.dotActionMap.set(actionId, action);
      }

      if (isHealAction(action)) {
        this.healActionMap.set(actionId, action);
      }
    });

    ActionManager.logger.info(`Success register person actions, actionIds: ${actionIds.join(' , ')}`);
  };

  private clearActionMap = () => {
    this.attackActionMap.clear();
    this.dotActionMap.clear();
    this.healActionMap.clear();
  };

  public startAttacking = () => {
    this.attackActionTimer.startTimer(this.person.attributePanel.AttackSpeed);
  };

  public stopAttacking = () => {
    this.nextAction = this.normalAttackAction;
    this.attackActionTimer.stopTimer();
  };

  public resetAttackActionProgress = () => {
    this.attackActionTimer.resetProgress();
  };

  public clearActiveDotActions = () => {
    this.activeDotActionMap.forEach((dot) => dot.abort());
    this.activeDotActionMap.clear();

    ActionManager.logger.debug(`Clear dot actions`);
  };

  public deployDotAction = (dotAction: BaseDotAction) => {
    this.activeDotActionMap.set(dotAction.id, dotAction);
    dotAction.effective();

    ActionManager.logger.debug(`Dot action ${dotAction.id} deployed in ${this.person.mode}`);
  };

  public undeployDotAction = (dotActionId: string) => {
    this.activeDotActionMap.get(dotActionId)?.abort();
    this.activeDotActionMap.delete(dotActionId);

    ActionManager.logger.debug(`Dot action ${dotActionId} deleted in ${this.person.mode}`);
  };

  private attackActionHandler = () => {
    if (isAttackAction(this.nextAction)) {
      this.nextAction.execute(this.person);
    }

    if (isDotAction(this.nextAction)) {
      this.nextAction.initialize(this.person);
      this.person.target?.actionManager.deployDotAction(this.nextAction);
    }

    if (isHealAction(this.nextAction)) {
      this.nextAction.execute(this.person);
    }

    console.log('actions', this.lastAction);
    this.event.emit(ActionManager.ActionManagerEventKeys.ExecuteAction, {
      person: this.person,
      action: this.nextAction,
      lastAction: this.lastAction,
    } as IActionManager.ExecuteActionPayload);

    if (this.person.isAttacking) {
      this.lastAction = this.nextAction;
      this.nextAction = this.pickNextAction();
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

    const healAction = this.pickHealAction();
    if (healAction) result = healAction;

    ActionManager.logger.debug(`${this.person.mode} next action: ${result.name}`);

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

      if (roll(dotAction.chance) && !this.dotActionIsExistInTarget(dotAction)) {
        result = dotAction;
        break;
      }
    }

    return result;
  };

  private dotActionIsExistInTarget = (dotAction: BaseDotAction) => {
    if (this.person.target === undefined)
      return ActionManager.logger.error('Try check dot is exist but target undefined');

    return this.person.target.actionManager.activeDotActionMap.has(dotAction.id);
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
}

export { ActionManager, IActionManager };
