import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@fisher/logger';
import { Reward } from './Reward.js';

class RewardPool {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'RewardPool');

  public pool: Reward[] = [];

  public get hasReward() {
    return this.pool.length > 0;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public collectRewards = (rewards: Reward[]) => {
    for (let index = 0; index < rewards.length; index++) {
      const reward = rewards[index];
      this.pool.push(reward);
    }

    return this;
  };

  public executeRewardPool = (shouldAlertInformation = false) => {
    if (!this.hasReward) {
      RewardPool.logger.error('Try to execute rewards but reward pool was empty');
      throw new Error('Try to execute rewards but reward pool was empty');
    }

    this.pool.forEach((reward) => reward.execute(shouldAlertInformation));
    this.pool = [];
  };
}

export { RewardPool };
