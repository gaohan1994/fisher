import { FisherBackpack, FisherGold, FisherBase } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE);

export class FisherCore extends FisherBase {
  public activeActionId: string = '';
  public fisherBackpack: FisherBackpack;
  public fisherGold: FisherGold;

  /**
   * Creates an instance of FisherCore.
   *
   * - 初始化各个模块如 Collection
   * - 从资源池中注册游戏数据包如 PackagesData
   * - 从存档中取出用户数据并初始化
   *
   * @memberof FisherCore
   */
  constructor() {
    super();
    // 初始化背包系统
    this.fisherBackpack = new FisherBackpack();
    // 初始化金币系统
    this.fisherGold = new FisherGold({});
  }
}

export function fisherLaunch() {
  logger.info('Fisher launch!');
  const fisher = new FisherCore();
  logger.info('Inject fisherCore into window object');
  typeof window !== undefined && (window.fisher = fisher);
  return fisher;
}
