import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'ActionControl');

interface FisherActionControlComponent {
  id: string;
  stop: () => void;
}

/**
 * action control
 * 游戏只允许一个技能处于激活状态
 * 如果某个技能激活则关闭其他技能
 *
 * @export
 * @class FisherActionControl
 * @template T
 */
export class FisherActionControl<T extends FisherActionControlComponent> {
  /**
   * 当前处于活跃状态的 action id
   *
   * @type {string}
   * @memberof FisherActionControl
   */
  public activeActionId: string = '';
  /**
   * 所有受控的 action map
   *
   * @type {Map<string, T>}
   * @memberof FisherActionControl
   */
  public componentMap: Map<string, T> = new Map();
  public disposes: IReactionDisposer[] = [];

  constructor() {
    makeAutoObservable(this);

    const actionControlDispose = reaction<string>(
      () => this.activeActionId,
      this._actionControlMethod
    );
    this.disposes.push(actionControlDispose);
  }

  /**
   * 设置当前活跃状态的 action id
   *
   * @param {string} value
   * @memberof FisherActionControl
   */
  public setActiveActionId = (value: string) => {
    this.activeActionId = value;
  };

  /**
   * 添加受控组件列表
   *
   * @param {T[]} components
   * @memberof FisherActionControl
   */
  public addActionControlComponents = (components: T[]) => {
    components.forEach((component) =>
      this.addActionControlComponent(component)
    );
  };

  /**
   * 添加受控组件
   *
   * @param {T} control
   * @memberof FisherActionControl
   */
  public addActionControlComponent = (component: T) => {
    logger.info(`Add component ${component.id} to AC`);
    this.componentMap.set(component.id, component);
  };

  /**
   * 控制所有配置的 actions
   *
   * @private
   * @param {IActionControlCondition} [
   *     isSomeActionActive,
   *     currentActiveActionId,
   *   ]
   * @memberof FisherActionControl
   */
  private _actionControlMethod = (currentActiveActionId: string) => {
    const isSomeActionActive = this.componentMap.has(currentActiveActionId);
    if (!isSomeActionActive) return this._stopAllComponents();

    this.componentMap.forEach((component) => {
      if (component.id !== this.activeActionId) {
        this._stopComponent(component);
      }
    });
  };

  private _stopAllComponents = () => {
    this.componentMap.forEach((component) => {
      this._stopComponent(component);
    });
  };

  private _stopComponent = (component: FisherActionControlComponent) => {
    component.stop();
    logger.info(`Action ${component.id} stop!`);
  };
}
