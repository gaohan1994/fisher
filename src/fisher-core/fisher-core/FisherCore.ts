import { makeAutoObservable } from 'mobx';
import {
  Mining,
  Reiki,
  FisherGold,
  FisherPerson,
  FisherBackpack,
  CollectionModule,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import invariant from 'invariant';

type FisherComponent = CollectionModule | undefined;

export class FisherCore {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE);
  // 背包
  public readonly fisherBackpack = new FisherBackpack();

  // 货币
  public readonly fisherGold = new FisherGold({});

  // 玩家
  public readonly master = new FisherPerson();

  public readonly mining = new Mining();

  public readonly reiki = new Reiki();

  // 当前处于激活状态的组件
  public activeComponent: FisherComponent = undefined;

  public get activeComponentId() {
    return this.activeComponent?.id;
  }

  /**
   * Creates an instance of FisherCore.
   *
   * - 初始化各个模块如
   * - 从资源池中注册游戏数据包如 PackagesData
   * - 从存档中取出用户数据并初始化
   *
   * @memberof FisherCore
   */
  constructor() {
    makeAutoObservable(this);
    this.master.initialize({
      name: '李逍遥',
      mode: FisherPerson.Mode.Master,
      level: FisherPerson.Level.GasRefiningEarly,
    });
  }

  /**
   * 设置激活的组件
   * 如果当前激活组件不等于传入的组件
   * 设置激活组件为传入组件
   * 如果当前激活的组件不为空则关闭当前组件
   *
   * @param {FisherComponent} component
   * @memberof FisherCore
   */
  public setActiveComponent = (component: FisherComponent) => {
    invariant(
      component !== undefined,
      'Tried setting active component to undefined!'
    );
    if (this.activeComponent !== component) {
      this.activeComponent?.stop();
      this.activeComponent = component;
      FisherCore.logger.info(`Set active component ${component.id}`);
    }
  };
}
