import { backpack } from '../fisher-backpack';
import { EventKeys, events } from '../fisher-events';
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

    events.emit(EventKeys.Backpack.ReduceItem, rewardChest, 1);
  };

  public static openRewardChestBatches = (rewardChest: RewardChest, quantity: number) => {
    let index = 0;

    while (index < quantity) {
      RewardChestHandler.openRewardChest(rewardChest);
      index++;
    }
  };
}

export { RewardChestHandler };
