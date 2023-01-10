import { prefixLogger, prefixes } from '@FisherLogger';
import { roll } from '../utils';
import { Item } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { bank } from '../fisher-bank';
import { backpack } from '../fisher-backpack';
import { store } from '../fisher-packages';
import { core } from '../fisher-core';

interface ICreateRewardOptions {
  gold?: number;
  itemId?: string;
  itemQuantity?: number;
  componentId?: string;
  experience?: number;
}

export class Reward {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Reward');

  public rewardItemMap: Map<Item, number> = new Map();

  public get rewardItems() {
    return [...this.rewardItemMap];
  }

  public get hasRewardItems() {
    return this.rewardItemMap.size > 0;
  }

  public rewardGold: number = 0;

  public get hasRewardGold() {
    return this.rewardGold > 0;
  }

  public rewardSkillExperience: Map<Skill, number> = new Map();

  static create = ({ gold, itemId, itemQuantity, componentId, experience }: ICreateRewardOptions): Reward => {
    const reward = new Reward();

    const _gold = gold ?? 0;
    if (_gold !== 0) {
      reward.addRewardGold(_gold);
    }

    if (itemId !== undefined) {
      const item = store.findItemById(itemId);
      reward.addRewardItem(item, itemQuantity ?? 1);
    }

    if (componentId !== undefined && experience !== undefined) {
      const component = core.findSkillComponentById(componentId);
      reward.addRewardSkill(component.skill, experience);
    }

    return reward;
  };

  /**
   * create random reward
   * if didn't hit the probability return undefined
   * if hit probability create rewards and return
   */
  static createRandomReward = (probability: number, options: ICreateRewardOptions): Reward | undefined => {
    if (!roll(probability)) {
      return undefined;
    }

    return Reward.create(options);
  };

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

  public addRewardGold = (gold: number): this => {
    this.rewardGold += gold;
    return this;
  };

  public setRewardGold = (gold: number): this => {
    this.rewardGold = gold;
    return this;
  };

  public addRewardSkill = (skill: Skill, experience: number): this => {
    const hasRewardSkill = this.rewardSkillExperience.has(skill);

    if (hasRewardSkill) {
      const rewardExperience = this.rewardSkillExperience.get(skill) ?? 0;
      this.rewardSkillExperience.set(skill, rewardExperience + experience);
    } else {
      this.rewardSkillExperience.set(skill, experience);
    }

    return this;
  };

  public setRewardSkill = (skill: Skill, experience: number): this => {
    this.rewardSkillExperience.set(skill, experience);
    return this;
  };

  public reset = () => {
    this.rewardGold = 0;
    this.rewardItemMap.clear();
    this.rewardSkillExperience.clear();
    Reward.logger.debug('Success reset rewards.');
  };

  public execute = () => {
    this.executeGold();
    this.executeRewardItems();
    this.executeSkillExperience();
  };

  private executeGold = () => {
    if (this.rewardGold > 0) {
      bank.receiveGold(this.rewardGold);
      Reward.logger.debug('Execute reward gold: ' + this.rewardGold);
    }
  };

  private executeRewardItems = () => {
    if (this.rewardItemMap.size > 0) {
      this.rewardItemMap.forEach((quantity, rewardItem) => {
        if (quantity > 0) {
          this.executeAddItem(rewardItem, quantity);
        } else {
          this.executeReduceItem(rewardItem, quantity);
        }
      });
    }
  };

  private executeAddItem = (rewardItem: Item, quantity: number) => {
    backpack.addItem(rewardItem, quantity);
    Reward.logger.debug('Execute add item: ' + rewardItem.name, 'quantity: ' + quantity);
  };

  private executeReduceItem = (rewardItem: Item, quantity: number) => {
    backpack.reduceItem(rewardItem, quantity);
    Reward.logger.debug('Execute reduce item: ' + rewardItem.name, 'quantity: ' + quantity);
  };

  private executeSkillExperience = () => {
    if (this.rewardSkillExperience.size > 0) {
      this.rewardSkillExperience.forEach((experience, rewardSkill) => {
        rewardSkill.addExperience(experience);
        Reward.logger.debug('Execute reward skill experience: ' + rewardSkill.id, 'experience: ' + experience);
      });
    }
  };
}
