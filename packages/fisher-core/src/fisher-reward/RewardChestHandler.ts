import { EventKeys, events } from '@shared';
import { Information, informationAlert } from '@information';
import { RewardChest } from '@item';
import { roll } from '../utils/index.js';
import { Reward } from './Reward.js';
import { RewardCache } from './RewardCache.js';
import { RewardPool } from './RewardPool.js';

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

    if (rewardChest.rewardExperience) {
      rewards.push(Reward.create({ componentId: rewardChest.componentId, experience: rewardChest.rewardExperience }));
    }

    if (rewardChest.randomRewardItems.length > 0) {
      rewardChest.randomRewardItems.forEach((randomReward) => {
        if (roll(randomReward.probability)) {
          rewards.push(Reward.create(randomReward));
        }
      });
    }

    for (let index = 0; index < rewards.length; index++) {
      const reward = rewards[index];
      reward.execute();
    }

    events.emit(EventKeys.Backpack.ReduceItem, rewardChest, 1);
  };

  public static openRewardChestBatches = (rewardChest: RewardChest, quantity: number) => {
    const rewardPool = new RewardPool();
    const rewardCache = new RewardCache();
    let componentId: string | undefined = undefined;

    const collectRewardChest = (chest: RewardChest) => {
      if (rewardChest.rewardItems.length > 0) {
        rewardCache.cacheItems(chest.rewardItems);
      }

      if (rewardChest.rewardGold) {
        rewardCache.cacheGold(rewardChest.rewardGold);
      }

      if (rewardChest.rewardExperience) {
        componentId = rewardChest.componentId;
        rewardCache.cacheExperience(rewardChest.rewardExperience);
      }

      if (rewardChest.randomRewardItems.length > 0) {
        rewardChest.randomRewardItems.forEach((randomReward) => {
          if (roll(randomReward.probability)) {
            rewardCache.cacheItems([randomReward]);
          }
        });
      }
    };

    let index = 0;

    while (index < quantity) {
      collectRewardChest(rewardChest);
      index++;
    }

    const message = new Information.NormalMessage(
      `您打开了${quantity}个${rewardChest.name}`,
      Information.InformationColor.Orange
    );
    informationAlert([message]);
    events.emit(EventKeys.Backpack.ReduceItem, rewardChest, quantity);
    console.log('componentId', componentId);
    rewardPool.collectRewards(rewardCache.createRewards(componentId!)).executeRewardPool(true);
  };
}

export { RewardChestHandler };
