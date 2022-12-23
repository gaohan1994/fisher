import { prefixes, prefixLogger } from '@FisherLogger';
import { ActionMode, BaseAction } from './BaseActions';
import { NormalAttackAction } from './AttackActions';
import { FisherPerson } from '../FisherPerson';

export class ActionManager {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ActionManager');

  private person: FisherPerson;

  public actionMap = new Map<ActionMode, BaseAction[]>();

  public get attackActions() {
    return this.actionMap.get(ActionMode.Attack) ?? [];
  }

  public actionDisposeMap = new Map();

  constructor(person: FisherPerson) {
    this.person = person;
  }

  public registerActionMap = () => {
    if (this.person.target === undefined) return;
    const attackActions = [new NormalAttackAction(this.person)];
    this.actionMap.set(ActionMode.Attack, attackActions);
    ActionManager.logger.debug('Success register action map');
  };

  /**
   * 拿到所有注册的 actions 并执行 actions
   * 如果 actions 产生副作用则把销毁副作用函数保存起来
   *
   * @param {ActionMode} mode
   * @memberof ActionManager
   */
  public startActions = (mode: ActionMode) => {
    const actions = this.actionMap.get(mode);
    if (!actions) {
      return ActionManager.logger.error(
        `Fail to start actions ${mode}, the ${mode} actions unregistered`
      );
    }
    actions.forEach((action) => {
      const actionDispose = action.execute();
      actionDispose && this.actionDisposeMap.set(action.id, actionDispose);
    });
  };

  /**
   * 执行所有 actions 的销毁函数
   * 清空销毁函数 map
   *
   * @memberof ActionManager
   */
  public stopActions = () => {
    this.actionDisposeMap.forEach((actionDispose) => {
      actionDispose();
    });
    this.actionDisposeMap.clear();
  };
}
