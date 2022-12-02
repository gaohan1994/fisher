import { makeAutoObservable } from 'mobx';
import { FisherItem } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherReward');

/**
 * 添加物品奖励
 *
 * @interface IFisherRewardAddRewardItem
 */
interface IFisherRewardAddRewardItem<This> {
  (item: FisherItem, quantity: number): This;
}

/**
 * 添加金钱奖励
 *
 * @interface IFisherRewardAddRewardGold
 */
interface IFisherRewardAddRewardGold<This> {
  (gold: number): This;
}

/**
 * 执行奖励
 *
 * @interface IFisherRewardsExecuteRewards
 */
interface IFisherRewardsExecuteRewards {
  (): void;
}

/**
 * 清空所有奖励
 *
 * @interface IFisherRewardResetRewards
 */
interface IFisherRewardResetRewards {
  (): void;
}

/**
 * FisherReward 奖励通用模块
 * 奖励由行为 action 触发
 * 每次执行 action 之后
 * - 奖励经验
 *  如果有经验奖励则应该遍历当前奖励类中存放的
 *  Map<FisherSkill, experience>
 *  给对应的 FisherSkill 加上 experience 经验
 * - 奖励物品
 *  如果有物品奖励直接加入背包 FisherBackpack
 * - 奖励金钱
 *  如果有金钱奖励直接计入金币系统 FisherGold
 *
 * @export
 * @class FisherReward
 */
export class FisherReward {
  /**
   * 物品奖励
   *
   * @type {Map<FisherItem, number>}
   * @memberof FisherReward
   */
  public rewardItems: Map<FisherItem, number> = new Map();

  /**
   * 金币奖励
   *
   * @type {number}
   * @memberof FisherReward
   */
  public rewardGold: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 添加物品奖励
   *
   * @param {*} item
   * @param {*} quantity
   * @type {IFisherRewardAddRewardItem}
   * @memberof FisherReward
   */
  public addRewardItem: IFisherRewardAddRewardItem<this> = (item, quantity) => {
    const hasRewardItem = this.rewardItems.has(item);
    if (hasRewardItem) {
      // 如果要添加的奖励物品已经存在
      // 奖励物品数量 + quantity
      const rewardItemQuantity = this.rewardItems.get(item) ?? 0;
      this.rewardItems.set(item, rewardItemQuantity + quantity);
      logger.info(
        'Success update reward item: ' + item.name,
        'quantity: ' + quantity,
        'current reward item quantity: ' + rewardItemQuantity + quantity
      );
    } else {
      // 如果不存在要添加的奖励物品
      // 则插入
      this.rewardItems.set(item, quantity);
      logger.info(
        `Success add reward item: ${item.name}, quantity: ${quantity}`
      );
    }
    return this;
  };

  /**
   * 添加金钱奖励
   *
   * @param {*} gold
   * @type {IFisherRewardAddRewardGold}
   * @memberof FisherReward
   */
  public addRewardGold: IFisherRewardAddRewardGold<this> = (gold) => {
    this.rewardGold += gold;
    logger.info(
      'Success add reward gold: ' + gold,
      'current total reward gold: ' + this.rewardGold
    );
    return this;
  };

  /**
   * 清空所有奖励
   *
   * @type {IFisherRewardResetRewards}
   * @memberof FisherReward
   */
  public resetRewards: IFisherRewardResetRewards = () => {
    this.rewardGold = 0;
    this.rewardItems.clear();
  };

  /**
   * 执行奖励
   *
   * @type {IFisherRewardsExecuteRewards}
   * @memberof FisherReward
   */
  public executeRewards: IFisherRewardsExecuteRewards = () => {
    if (this.rewardGold > 0) {
      logger.info('Execute reward gold: ' + this.rewardGold);
      fisher.fisherGold.receiveGold(this.rewardGold);
    }
    if (this.rewardItems.size > 0) {
      this.rewardItems.forEach((quantity, rewardItem) => {
        logger.info(
          'Execute reward item: ' + rewardItem.name,
          'quantity: ' + quantity
        );
        fisher.fisherBackpack.addItem(rewardItem, quantity);
      });
    }
  };
}
