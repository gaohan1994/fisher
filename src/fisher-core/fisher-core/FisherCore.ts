import {
  IFisherPackagesData,
  Mining,
  FisherGold,
  FisherBackpack,
  launchFisherGamePackagesData,
} from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import { makeAutoObservable } from 'mobx';

const logger = prefixLogger(prefixes.FISHER_CORE);

export class FisherCore {
  public activeActionId: string = '';
  public fisherBackpack: FisherBackpack;
  public fisherGold: FisherGold;
  public packagesData: IFisherPackagesData = {
    items: [],
    recipes: [],
  };
  public mining: Mining;

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
    // 初始化背包系统
    this.fisherBackpack = new FisherBackpack();
    // 初始化金币系统
    this.fisherGold = new FisherGold({});
    // 初始化采矿系统
    this.mining = new Mining();
    // 初始化游戏数据
    launchFisherGamePackagesData(this);
  }

  public setActiveActionId = (value: string) => {
    this.activeActionId = value;
  };
}

export function fisherLaunch() {
  logger.info('Fisher launch!');
  const fisher = new FisherCore();

  logger.info('Inject fisherCore into window object');
  typeof window !== undefined && (window.fisher = fisher);

  return fisher;
}
