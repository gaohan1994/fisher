import { prefixes, prefixLogger } from '@FisherLogger';
import { Reward } from './Reward';

class RewardPool {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'RewardPool');

  public pool: Reward[] = [];

  public get hasReward() {
    return this.pool.length > 0;
  }

  public collectRewards = (rewards: Reward[]) => {
    for (let index = 0; index < rewards.length; index++) {
      const reward = rewards[index];
      this.pool.push(reward);
    }
  };

  public executeRewardPool = () => {
    if (!this.hasReward) {
      RewardPool.logger.error('Try to execute rewards but reward pool was empty');
      throw new Error('Try to execute rewards but reward pool was empty');
    }

    this.pool.forEach((reward) => reward.execute());
    this.pool = [];
  };
}

export { RewardPool };
