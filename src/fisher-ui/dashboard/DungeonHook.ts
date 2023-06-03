import React from 'react';
import { DungeonItem, EnemyItem, Item, core, store } from '@FisherCore';

const useDungeonItemRewards = (dungeonItem: DungeonItem) => {
  const result = new Set<Item>();

  dungeonItem.enemies.forEach((enemy) => {
    enemy.itemRewards.forEach((rewardInfo) => {
      result.add(store.findItemById(rewardInfo.itemId));
    });

    enemy.randomRewards.forEach((rewardInfo) => {
      result.add(store.findItemById(rewardInfo.itemId));
    });
  });

  [...dungeonItem.progressExtraRewardMap].forEach(([_, rewardsInfo]) => {
    rewardsInfo.forEach((rewardInfo) => {
      if (!!rewardInfo.itemId) {
        result.add(store.findItemById(rewardInfo.itemId));
      }
    });
  });

  return {
    rewards: Array.from(result),
  };
};

interface IRewardDetail {
  rewardItems: Item[];
  randomRewardItems: Item[];
}
const useDungeonEnemyRewardMap = (dungeonItem: DungeonItem) => {
  const enemyRewardMap = new Map<EnemyItem, IRewardDetail>();

  dungeonItem.enemies.forEach((enemy) => {
    const rewardItemSet = new Set<Item>();
    const randomRewardItemSet = new Set<Item>();

    enemy.itemRewards.forEach((item) => rewardItemSet.add(store.findItemById(item.itemId)));
    enemy.randomRewards.forEach((item) => randomRewardItemSet.add(store.findItemById(item.itemId)));

    enemyRewardMap.set(enemy, {
      rewardItems: Array.from(rewardItemSet),
      randomRewardItems: Array.from(randomRewardItemSet),
    });
  });

  return { enemyRewards: Array.from(enemyRewardMap) };
};

const useDungeonProgressReward = (dungeonItem: DungeonItem) => {
  const progressRewardMap = new Map<number, Item[]>();

  dungeonItem.progressExtraRewardMap.forEach((rewards, index) => {
    const rewardItemSet = new Set<Item>();
    rewards.forEach((reward) => reward.itemId && rewardItemSet.add(store.findItemById(reward.itemId)));

    progressRewardMap.set(Number(index), Array.from(rewardItemSet));
  });

  return { progressRewards: Array.from(progressRewardMap) };
};

const useIsActiveDungeonItem = (dungeonItem: DungeonItem) => {
  const { dungeon } = core;

  return React.useMemo(
    () => dungeon.activeDungeonItem?.id === dungeonItem.id,
    [dungeon.activeDungeonItem, dungeonItem]
  );
};

export { useDungeonItemRewards, useIsActiveDungeonItem, useDungeonEnemyRewardMap, useDungeonProgressReward };
