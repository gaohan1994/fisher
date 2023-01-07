import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { prefixes, prefixLogger } from '@FisherLogger';
import { ActionMode, BaseAction, DotAction } from './BaseActions';
import { NormalAttackAction } from './AttackActions';
import { Person } from '../Person';
import { PersonStateDotAction } from './DotActions';
import { roll } from '../../utils';
import { Timer } from '../../fisher-timer';

export class ActionManager {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  private person: Person;

  public actionMap = new Map<ActionMode, BaseAction[]>();

  public activeDotMap = new Map<string, DotAction>();

  public normalAttackAction: NormalAttackAction;

  public nextAttackAction: BaseAction | DotAction;

  public attackActionTimer = new Timer('AttackActionTimer', () => this.attackActionHandler(), { showProgress: true });

  public get activeDots() {
    return [...this.activeDotMap.values()];
  }

  constructor(person: Person) {
    makeAutoObservable(this);

    this.person = person;
    this.normalAttackAction = new NormalAttackAction(this.person);
    this.nextAttackAction = this.normalAttackAction;
  }

  /**
   * 开始进攻
   *
   * @memberof ActionManager
   */
  public startAttacking = () => {
    this.attackActionTimer.startTimer(this.person.attributePanel.AttackSpeed);
  };

  /**
   * 停止攻击
   *
   * @memberof ActionManager
   */
  public stopAttacking = () => {
    this.nextAttackAction = this.normalAttackAction;
    this.attackActionTimer.stopTimer();
  };

  /**
   * 清空正在执行的dots
   *
   * @memberof ActionManager
   */
  public clearActiveDots = () => {
    this.activeDotMap.forEach((dot) => dot.abort());
    this.activeDotMap.clear();
  };

  public applicationDot = (dot: DotAction) => {
    this.activeDotMap.set(dot.id, dot);
    dot.effective();

    ActionManager.logger.info(`dot ${dot.id} application in ${this.person.mode}`);
  };

  public deleteDot = (dotId: string) => {
    this.activeDotMap.get(dotId)?.abort();
    this.activeDotMap.delete(dotId);

    ActionManager.logger.info(`dotId ${dotId} deleted in ${this.person.mode}`);
  };

  private attackActionHandler = () => {
    if (this.nextAttackAction instanceof NormalAttackAction) {
      this.nextAttackAction.execute();
    }

    if (this.nextAttackAction instanceof DotAction) {
      this.nextAttackAction.initialize();
      this.person.target?.actionManager.applicationDot(this.nextAttackAction);
    }

    if (this.person.isAttacking) {
      this.pickNextAttackAction();
    }
  };

  private pickNextAttackAction = (): void => {
    let _nextAttackAction: BaseAction | DotAction = this.normalAttackAction;

    const dotAction = this.pickDotAction();
    if (dotAction) _nextAttackAction = dotAction;

    this.nextAttackAction = _nextAttackAction;
  };

  private pickDotAction = (): DotAction | undefined => {
    let result: DotAction | undefined = undefined;

    const dots = this.actionMap.get(ActionMode.Dot) as DotAction[];
    if (!dots) return result;

    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index];

      if (roll(dot.chance) && !this.dotIsExistInTarget(dot)) {
        result = dot;
        break;
      }
    }
    return result;
  };

  private dotIsExistInTarget = (dot: DotAction): boolean => {
    invariant(this.person.target !== undefined, 'Try check dot is exist but target undefined');
    return this.person.target.actionManager.activeDotMap.has(dot.id);
  };

  public registerActionMap = () => {
    const attackActions = [this.normalAttackAction];
    this.actionMap.set(ActionMode.Attack, attackActions);

    const dotActions = [new PersonStateDotAction(this.person)];
    this.actionMap.set(ActionMode.Dot, dotActions);
  };
}
