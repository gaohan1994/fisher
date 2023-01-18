import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  BaseAttackAction,
  BaseDotAction,
  NormalAttackAction,
  CritAttackAction,
  PosionDotAction,
} from '../fisher-actions';
import { Timer } from '../fisher-timer';
import { roll } from '../utils';
import { Person } from './Person';

type NextAttackAction = NormalAttackAction | CritAttackAction | BaseDotAction;

export class ActionManager {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  private person: Person;

  // 普通攻击
  public normalAttackAction = new NormalAttackAction();

  // 暴击
  public critAttackAction = new CritAttackAction();

  // 准备执行的攻击方式
  public nextAttackAction: NextAttackAction = this.normalAttackAction;

  // 可能触发的 Dot
  public dotActionMap = new Map<string, BaseDotAction>();

  public get dotActions() {
    return [...this.dotActionMap.values()];
  }

  public activeDotActionMap = new Map<string, BaseDotAction>();

  public get activeDotActions() {
    return [...this.activeDotActionMap.values()];
  }

  public attackActionTimer = new Timer('AttackActionTimer', () => this.attackActionHandler(), { showProgress: true });

  constructor(person: Person) {
    makeAutoObservable(this);

    this.person = person;
    this.registerActions();
  }

  private registerActions = () => {
    this.registerDotActions();
  };

  private registerDotActions = () => {
    const posionDotAction = new PosionDotAction();
    this.dotActionMap.set(posionDotAction.id, posionDotAction);
  };

  public startAttacking = () => {
    this.attackActionTimer.startTimer(this.person.attributePanel.AttackSpeed);
  };

  public stopAttacking = () => {
    this.nextAttackAction = this.normalAttackAction;
    this.attackActionTimer.stopTimer();
  };

  public clearActiveDotActions = () => {
    this.activeDotActionMap.forEach((dot) => dot.abort());
    this.activeDotActionMap.clear();

    ActionManager.logger.debug(`Clear dot actions`);
  };

  public deployDotAction = (dotAction: BaseDotAction) => {
    this.activeDotActionMap.set(dotAction.id, dotAction);
    dotAction.effective();

    ActionManager.logger.debug(`Dot action ${dotAction.id} deployed in ${this.person.id}`);
  };

  public undeployDotAction = (dotActionId: string) => {
    this.activeDotActionMap.get(dotActionId)?.abort();
    this.activeDotActionMap.delete(dotActionId);

    ActionManager.logger.debug(`Dot action ${dotActionId} deleted in ${this.person.id}`);
  };

  private attackActionHandler = () => {
    if (this.nextAttackAction instanceof BaseAttackAction) {
      this.nextAttackAction.execute(this.person);
    }

    if (this.nextAttackAction instanceof BaseDotAction) {
      this.nextAttackAction.initialize(this.person);
      this.person.target?.actionManager.deployDotAction(this.nextAttackAction);
    }

    if (this.person.isAttacking) {
      this.pickNextAttackAction();
    }
  };

  private pickNextAttackAction = (): void => {
    let _nextAttackAction: NextAttackAction = this.normalAttackAction;

    const critAction = this.pickCritAction();
    if (critAction) _nextAttackAction = critAction;

    const dotAction = this.pickDotAction();
    if (dotAction) _nextAttackAction = dotAction;

    this.nextAttackAction = _nextAttackAction;

    ActionManager.logger.debug(`${this.person.id} next attack action: ${this.nextAttackAction.name}`);
  };

  private pickCritAction = (): CritAttackAction | undefined => {
    let result: CritAttackAction | undefined = undefined;

    if (roll(this.critAttackAction.change)) {
      result = this.critAttackAction;
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
}
