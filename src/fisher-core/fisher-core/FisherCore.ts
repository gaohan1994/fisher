import { makeAutoObservable } from 'mobx';
import {
  Mining,
  Reiki,
  FisherGold,
  FisherBackpack,
  FisherActionControl,
  FisherPerson,
  PersonLevel,
  FisherComponent,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

export class FisherCore {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE);
  /**
   * 背包
   *
   * @type {FisherBackpack}
   * @memberof FisherCore
   */
  public fisherBackpack: FisherBackpack;

  /**
   * 货币
   *
   * @type {FisherGold}
   * @memberof FisherCore
   */
  public fisherGold: FisherGold;

  /**
   * AC action 管理
   *
   * @type {FisherActionControl<any>}
   * @memberof FisherCore
   */
  public fisherActionControl: FisherActionControl<any>;

  /**
   * 采矿
   *
   * @type {Mining}
   * @memberof FisherCore
   */
  public mining: Mining;

  /**
   * 灵气
   *
   * @type {Reiki}
   * @memberof FisherCore
   */
  public reiki: Reiki;

  /**
   * 玩家
   *
   * @type {FisherPerson}
   * @memberof FisherCore
   */
  public master: FisherPerson;

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
    this.fisherBackpack = new FisherBackpack();
    this.fisherGold = new FisherGold({});
    this.mining = new Mining();
    this.reiki = new Reiki();
    this.master = new FisherPerson({
      id: 'Master',
      name: 'Harper Gao',
      level: PersonLevel.GasRefiningEarly,
    });
    // 配置受控的 action 系统
    this.fisherActionControl = new FisherActionControl();
    this.fisherActionControl.addActionControlComponents([
      this.mining,
      this.reiki,
    ]);
  }

  public get activeComponentId() {
    return this.fisherActionControl.activeComponentId;
  }

  public setActiveComponent = (component: FisherComponent) => {
    this.fisherActionControl.setActiveComponent(component);
  };
}
