import { Item, FisherSkill } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherReward');

/**
 * 添加物品奖励
 *
 * @interface IFisherRewardAddRewardItem
 */
interface IFisherRewardAddRewardItem<This> {
  (item: Item, quantity: number): This;
}

type IFisherRewardSetRewardItem<T> = IFisherRewardAddRewardItem<T>;

/**
 * 添加金钱奖励
 *
 * @interface IFisherRewardAddRewardGold
 */
interface IFisherRewardAddRewardGold<This> {
  (gold: number): This;
}

type IFisherRewardSetRewardGold<T> = IFisherRewardAddRewardGold<T>;

/**
 * 添加技能经验奖励
 *
 * @interface IFisherRewardAddRewardGold
 */
interface IFisherRewardAddRewardSkillExperience<This> {
  (skill: FisherSkill, experience: number): This;
}

type IFisherRewardSetRewardSkillExperience<T> =
  IFisherRewardAddRewardSkillExperience<T>;

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
   * @type {Map<Item, number>}
   * @memberof FisherReward
   */
  public rewardItemMap: Map<Item, number> = new Map();

  public get hasRewardItems() {
    return this.rewardItemMap.size > 0;
  }

  /**
   * 金币奖励
   *
   * @type {number}
   * @memberof FisherReward
   */
  public rewardGold: number = 0;

  public get hasRewardGold() {
    return this.rewardGold > 0;
  }

  /**
   * 技能经验奖励
   *
   * @type {Map<FisherSkill, number>}
   * @memberof FisherReward
   */
  public rewardSkillExperience: Map<FisherSkill, number> = new Map();

  public get rewardItems() {
    const result: { item: Item; quantity: number }[] = [];
    this.rewardItemMap.forEach((rewardQuantity, rewardItem) =>
      result.push({ item: rewardItem, quantity: rewardQuantity })
    );
    return result;
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
    const hasRewardItem = this.rewardItemMap.has(item);

    if (hasRewardItem) {
      // 如果要添加的奖励物品已经存在
      // 奖励物品数量 + quantity
      const rewardItemQuantity = this.rewardItemMap.get(item) ?? 0;
      this.rewardItemMap.set(item, rewardItemQuantity + quantity);
    } else {
      // 如果不存在要添加的奖励物品
      // 则插入
      this.rewardItemMap.set(item, quantity);
    }
    return this;
  };

  public setRewardItem: IFisherRewardSetRewardItem<this> = (item, quantity) => {
    this.rewardItemMap.set(item, quantity);
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
    return this;
  };

  public setRewardGold: IFisherRewardSetRewardGold<this> = (gold) => {
    this.rewardGold = gold;
    return this;
  };

  /**
   * 添加技能经验奖励
   *
   * @param {*} skill
   * @param {*} experience
   * @type {IFisherRewardAddRewardSkillExperience<this>}
   * @memberof FisherReward
   */
  public addRewardSkill: IFisherRewardAddRewardSkillExperience<this> = (
    skill,
    experience
  ) => {
    const hasRewardSkill = this.rewardSkillExperience.has(skill);

    if (hasRewardSkill) {
      // 如果要添加的技能已经存在
      // 奖励技能经验 + experience
      const rewardExperience = this.rewardSkillExperience.get(skill) ?? 0;
      this.rewardSkillExperience.set(skill, rewardExperience + experience);
    } else {
      // 如果不存在要添加的技能
      this.rewardSkillExperience.set(skill, experience);
    }
    return this;
  };

  public setRewardSkill: IFisherRewardSetRewardSkillExperience<this> = (
    skill,
    experience
  ) => {
    this.rewardSkillExperience.set(skill, experience);
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
    this.rewardItemMap.clear();
    this.rewardSkillExperience.clear();

    logger.debug('Success reset rewards.');
  };

  /**
   * 执行奖励
   *
   * @type {IFisherRewardsExecuteRewards}
   * @memberof FisherReward
   */
  public executeRewards: IFisherRewardsExecuteRewards = () => {
    if (this.rewardGold > 0) {
      logger.debug('Execute reward gold: ' + this.rewardGold);

      fisher.fisherGold.receiveGold(this.rewardGold);
    }

    if (this.rewardItemMap.size > 0) {
      this.rewardItemMap.forEach((quantity, rewardItem) => {
        logger.debug(
          'Execute reward item: ' + rewardItem.name,
          'quantity: ' + quantity
        );

        fisher.fisherBackpack.addItem(rewardItem, quantity);
      });
    }

    if (this.rewardSkillExperience.size > 0) {
      this.rewardSkillExperience.forEach((experience, rewardSkill) => {
        logger.debug(
          'Execute reward skill experience: ' + rewardSkill.name,
          'experience: ' + experience
        );

        rewardSkill.addExperience(experience);
      });
    }
  };
}
