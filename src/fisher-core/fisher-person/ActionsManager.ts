import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { NormalAttackAction, BaseAttackAction, BaseDotAction, PersonStateDotAction } from '../fisher-actions';
import { Timer } from '../fisher-timer';
import { Person } from './Person';
import { roll } from '../utils';

export class ActionManager {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  private person: Person;

  public normalAttackAction = new NormalAttackAction();

  public dotActionMap = new Map<string, BaseDotAction>();

  public get dotActions() {
    return [...this.dotActionMap.values()];
  }

  public activeDotActionMap = new Map<string, BaseDotAction>();

  public get activeDotActions() {
    return [...this.activeDotActionMap.values()];
  }

  public nextAttackAction: BaseAttackAction | BaseDotAction = this.normalAttackAction;

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
    // if (this.person.hasPersonStateAction)
    const personStateDotAction = new PersonStateDotAction();
    this.dotActionMap.set(personStateDotAction.id, personStateDotAction);
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

    ActionManager.logger.debug(`Dot action ${dotAction.id} deployed in ${this.person.mode} ${this.person.name}`);
  };

  public undeployDotAction = (dotActionId: string) => {
    this.activeDotActionMap.get(dotActionId)?.abort();
    this.activeDotActionMap.delete(dotActionId);

    ActionManager.logger.debug(`Dot action ${dotActionId} deleted in ${this.person.mode} ${this.person.name}`);
  };

  private attackActionHandler = () => {
    if (this.nextAttackAction instanceof NormalAttackAction) {
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
    let _nextAttackAction: BaseAttackAction | BaseDotAction = this.normalAttackAction;

    const dotAction = this.pickDotAction();
    if (dotAction) _nextAttackAction = dotAction;

    this.nextAttackAction = _nextAttackAction;

    ActionManager.logger.debug(`Next attack action: ${this.nextAttackAction.name}`);
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
