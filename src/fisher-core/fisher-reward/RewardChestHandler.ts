import { RewardChest } from '../fisher-item';
import { Reward } from './Reward';

class RewardChestHandler {
  public static openRewardChest = (rewardChest: RewardChest) => {
    let rewards: Reward[] = [];

    if (rewardChest.rewardItems.length > 0) {
      rewardChest.rewardItems.forEach((rewardItemPayload) => {
        rewards.push(Reward.create(rewardItemPayload));
      });
    }

    if (rewardChest.rewardGold) {
      rewards.push(Reward.create({ gold: rewardChest.rewardGold }));
    }

    if (rewardChest.rewardSkill) {
      rewards.push(Reward.create(rewardChest.rewardSkill));
    }

    for (let index = 0; index < rewards.length; index++) {
      const reward = rewards[index];
      reward.execute();
    }
  };
}

export { RewardChestHandler };
