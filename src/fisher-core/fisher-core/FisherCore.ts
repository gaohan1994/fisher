import {
  IFisherPackagesData,
  launchFisherGamePackagesData,
  Mining,
  FisherGold,
  FisherBackpack,
  FisherActionControl,
  Reiki,
  FisherPerson,
  PersonLevel,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import { makeAutoObservable } from 'mobx';

const logger = prefixLogger(prefixes.FISHER_CORE);

export class FisherCore {
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
   * 游戏数据
   * - items 基础物品
   * - recipes 采集物品配方
   *
   * @type {IFisherPackagesData}
   * @memberof FisherCore
   */
  public packagesData: IFisherPackagesData = {
    items: [],
    recipes: [],
    recipePartMap: new Map(),
  };

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
    launchFisherGamePackagesData(this);

    // 配置受控的 action 系统
    this.fisherActionControl = new FisherActionControl();
    this.fisherActionControl.addActionControlComponents([
      this.mining,
      this.reiki,
    ]);
  }

  public get activeActionId() {
    return this.fisherActionControl.activeActionId;
  }

  public setActiveActionId = (value: string) => {
    this.fisherActionControl.setActiveActionId(value);
  };
}
