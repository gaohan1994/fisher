import { autorun, makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  ActionMode,
  BaseAction,
  DotAction,
  IExecuteActionDispose,
} from './BaseActions';
import { NormalAttackAction } from './AttackActions';
import { FisherPerson } from '../FisherPerson';
import { PersonStateDotAction } from './DotActions';
import { checkHitProbability } from '../../utils';
import { FisherProgressTimer } from '../../fisher-timer';

export class ActionManager {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  private person: FisherPerson;

  public actionMap = new Map<ActionMode, BaseAction[]>();

  public activeDotMap = new Map<string, DotAction>();

  public normalAttackAction: NormalAttackAction;

  public actionDisposeMap = new Map();

  public nextAttackAction: BaseAction | DotAction;

  public attackActionTimer = new FisherProgressTimer(
    'attackActionTimer',
    () => this.attackActionHandler(),
    { once: true }
  );

  public get activeDots() {
    return [...this.activeDotMap.values()];
  }

  constructor(person: FisherPerson) {
    makeAutoObservable(this);

    this.person = person;

    this.normalAttackAction = new NormalAttackAction(this.person);
    this.nextAttackAction = this.normalAttackAction;

    this.registerActionMap();

    const dotEffectiveDispose = autorun(() => this.activeDotListener());
    this.setDispose('dotEffectiveDispose', dotEffectiveDispose);
  }

  public dispose = () => {
    this.actionDisposeMap.forEach((actionDispose) => {
      actionDispose();
    });
    this.actionDisposeMap.clear();
  };

  public setDispose = (id: string, actionDispose: IExecuteActionDispose) => {
    this.actionDisposeMap.set(id, () => actionDispose());
  };

  /**
   * 开始进攻
   *
   * @memberof ActionManager
   */
  public startAttacking = () => {
    this.attackActionHandler();
  };

  /**
   * 停止攻击
   *
   * @memberof ActionManager
   */
  public stopAttacking = () => {
    this.nextAttackAction.timer.stopTimer();
    this.attackActionTimer.stopTimer();
    this.attackActionTimer.resetProgress();
  };

  private attackActionHandler = () => {
    if (this.nextAttackAction instanceof NormalAttackAction) {
      this.nextAttackAction.execute();
    }

    if (this.nextAttackAction instanceof PersonStateDotAction) {
      this.nextAttackAction.application(this.person.target);
    }

    if (this.person.isAttacking) {
      this.pickNextAttackAction();
    }
  };

  private pickNextAttackAction = (): void => {
    let _nextAttackAction: BaseAction | DotAction = this.normalAttackAction;

    const dotAction = this.pickDotAction();
    if (dotAction) {
      _nextAttackAction = dotAction;
    }

    this.nextAttackAction = _nextAttackAction;
    this.attackActionTimer.startTimer(this.person.attributePanel.AttackSpeed);
  };

  private pickDotAction = (): DotAction | undefined => {
    let dotAction: DotAction | undefined = undefined;

    const dots = this.actionMap.get(ActionMode.Dot) as DotAction[];
    if (!dots) return dotAction;

    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index];

      if (checkHitProbability(dot.chance) && !this.dotIsExist(dot)) {
        dotAction = dot;
        break;
      }
    }
    return dotAction;
  };

  private dotIsExist = (dot: DotAction): boolean => {
    return this.activeDotMap.has(dot.id);
  };

  private activeDotListener = () => {
    for (let index = 0; index < this.activeDots.length; index++) {
      const dot = this.activeDots[index];
      if (dot.isFinished) {
        this.actionDisposeMap.delete(dot.id);
        continue;
      }
      dot.effective();
    }
  };

  private registerActionMap = () => {
    const attackActions = [this.normalAttackAction];
    this.actionMap.set(ActionMode.Attack, attackActions);

    const dotActions = [new PersonStateDotAction(this.person)];
    this.actionMap.set(ActionMode.Dot, dotActions);
  };
}
