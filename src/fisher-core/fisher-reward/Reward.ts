import { Item, FisherSkill } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'Reward');

export class Reward {
  /**
   * 物品奖励
   * @type {Map<Item, number>}
   * @memberof Reward
   */
  public rewardItemMap: Map<Item, number> = new Map();

  public get rewardItems() {
    return [...this.rewardItemMap];
  }

  public get hasRewardItems() {
    return this.rewardItemMap.size > 0;
  }

  /**
   * 金币奖励
   */
  public rewardGold: number = 0;

  public get hasRewardGold() {
    return this.rewardGold > 0;
  }

  /**
   * 技能经验奖励
   */
  public rewardSkillExperience: Map<FisherSkill, number> = new Map();

  /**
   * 添加物品奖励
   * 如果要添加的奖励物品已经存在，奖励物品数量 + quantity
   * 如果不存在要添加的奖励物品，则插入
   */
  public addRewardItem = (item: Item, quantity: number): this => {
    const hasRewardItem = this.rewardItemMap.has(item);

    if (hasRewardItem) {
      const rewardItemQuantity = this.rewardItemMap.get(item) ?? 0;
      this.rewardItemMap.set(item, rewardItemQuantity + quantity);
    } else {
      this.rewardItemMap.set(item, quantity);
    }
    return this;
  };

  public setRewardItem = (item: Item, quantity: number): this => {
    this.rewardItemMap.set(item, quantity);
    return this;
  };

  /**
   * 添加金钱奖励
   */
  public addRewardGold = (gold: number): this => {
    this.rewardGold += gold;
    return this;
  };

  public setRewardGold = (gold: number): this => {
    this.rewardGold = gold;
    return this;
  };

  /**
   * 添加技能经验奖励
   * 如果要添加的技能已经存在
   * 奖励技能经验 + experience
   */
  public addRewardSkill = (skill: FisherSkill, experience: number): this => {
    const hasRewardSkill = this.rewardSkillExperience.has(skill);

    if (hasRewardSkill) {
      const rewardExperience = this.rewardSkillExperience.get(skill) ?? 0;
      this.rewardSkillExperience.set(skill, rewardExperience + experience);
    } else {
      this.rewardSkillExperience.set(skill, experience);
    }

    return this;
  };

  public setRewardSkill = (skill: FisherSkill, experience: number): this => {
    this.rewardSkillExperience.set(skill, experience);
    return this;
  };

  /**
   * 清空所有奖励
   */
  public resetRewards = () => {
    this.rewardGold = 0;
    this.rewardItemMap.clear();
    this.rewardSkillExperience.clear();

    logger.debug('Success reset rewards.');
  };

  /**
   * 执行奖励
   */
  public executeRewards = () => {
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

        fisher.backpack.addItem(rewardItem, quantity);
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
