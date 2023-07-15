import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { roll } from '../utils';
import { Item } from '../fisher-item';
import { Store } from '../fisher-packages';
import { EventKeys, events } from '../fisher-events';

export interface ICreateRewardOptions {
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

  public rewardSkillExperience: Map<string, number> = new Map();

  public get hasRewardExperience() {
    return this.rewardSkillExperience.size > 0;
  }

  public get rewardExperience() {
    return [...this.rewardSkillExperience];
  }

  constructor() {
    makeAutoObservable(this);
  }

  static create = ({ gold, itemId, itemQuantity, componentId, experience }: ICreateRewardOptions): Reward => {
    const reward = new Reward();

    const _gold = gold ?? 0;
    if (_gold !== 0) {
      reward.addRewardGold(_gold);
    }

    if (itemId !== undefined) {
      const item = Store.create().findItemById(itemId);
      reward.addRewardItem(item, itemQuantity ?? 1);
    }

    if (componentId !== undefined && experience !== undefined) {
      reward.addRewardSkill(componentId, experience);
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

  public addRewardSkill = (componentId: string, experience: number): this => {
    const hasRewardSkill = this.rewardSkillExperience.has(componentId);

    if (hasRewardSkill) {
      const rewardExperience = this.rewardSkillExperience.get(componentId) ?? 0;
      this.rewardSkillExperience.set(componentId, rewardExperience + experience);
    } else {
      this.rewardSkillExperience.set(componentId, experience);
    }

    return this;
  };

  public setRewardSkill = (componentId: string, experience: number): this => {
    this.rewardSkillExperience.set(componentId, experience);
    return this;
  };

  public reset = () => {
    this.rewardGold = 0;
    this.rewardItemMap.clear();
    this.rewardSkillExperience.clear();
    Reward.logger.debug('Success reset rewards.');
  };

  public execute = (shouldAlertInformation = false) => {
    this.executeGold(shouldAlertInformation);
    this.executeRewardItems(shouldAlertInformation);
    this.executeSkillExperience(shouldAlertInformation);

    Reward.logger.debug('Success execute rewards.');
  };

  private executeGold = (shouldAlertInformation: boolean) => {
    if (this.rewardGold && this.rewardGold !== 0) {
      events.emit(EventKeys.Bank.ReceiveGold, this.rewardGold, shouldAlertInformation);
    }
  };

  private executeRewardItems = (shouldAlertInformation: boolean) => {
    if (this.rewardItemMap.size > 0) {
      this.rewardItemMap.forEach((quantity, item) => {
        if (quantity > 0) {
          events.emit(EventKeys.Backpack.AddItem, item, quantity, shouldAlertInformation);
        } else {
          events.emit(EventKeys.Backpack.ReduceItem, item, quantity, shouldAlertInformation);
        }
      });
    }
  };

  private executeSkillExperience = (shouldAlertInformation: boolean) => {
    if (this.rewardSkillExperience.size > 0) {
      this.rewardSkillExperience.forEach((experience, componentId) => {
        events.emit(EventKeys.Reward.RewardExperience, componentId, experience);
      });
    }
  };
}
