import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { CollectionModule } from '../fisher-modules';
import invariant from 'invariant';

export type FisherComponent = CollectionModule | undefined;

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
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'ActionControl');

  /**
   * 当前处于激活状态的组件
   *
   * @type {FisherComponent}
   * @memberof FisherActionControl
   */
  public activeComponent: FisherComponent = undefined;
  /**
   * 所有受控的模块
   *
   * @type {Map<string, T>}
   * @memberof FisherActionControl
   */
  public componentMap: Map<string, T> = new Map();
  public disposes: IReactionDisposer[] = [];

  constructor() {
    makeAutoObservable(this);

    const actionControlDispose = reaction(
      () => this.activeComponentId,
      this._actionControlMethod
    );
    this.disposes.push(actionControlDispose);
  }

  public get activeComponentId() {
    return this.activeComponent?.id;
  }

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
    FisherActionControl.logger.info(`Add component ${component.id} to AC`);
    this.componentMap.set(component.id, component);
  };

  /**
   * 控制所有配置的 actions
   *
   * @private
   * @param {IActionControlCondition} [
   *     isSomeActionActive,
   *     currentActiveComponentId,
   *   ]
   * @memberof FisherActionControl
   */
  private _actionControlMethod = (currentActiveComponentId?: string) => {
    const isSomeActionActive =
      currentActiveComponentId !== undefined &&
      this.componentMap.has(currentActiveComponentId);
    if (!isSomeActionActive) return this._stopAllComponents();

    this.componentMap.forEach((component) => {
      if (component.id !== currentActiveComponentId) {
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
    FisherActionControl.logger.info(`Action ${component.id} stop!`);
  };

  /**
   * 设置激活的组件
   *
   * @param {FisherComponent} component
   * @memberof FisherActionControl
   */
  public setActiveComponent = (component: FisherComponent) => {
    invariant(
      component !== undefined,
      'Tried setting active component to undefined!'
    );
    this.activeComponent = component;
    FisherActionControl.logger.info(`Set active component ${component.id}`);
  };
}
