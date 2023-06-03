import React from 'react';
import { EnemyItem, Item, core, store } from '@FisherCore';

const useBattleEnemyItemRewards = (enemyItem: EnemyItem) => {
  const rewardItems = React.useMemo(() => {
    const result: Set<Item> = new Set();

    enemyItem.itemRewards.forEach((rewardInfo) => {
      result.add(store.findItemById(rewardInfo.itemId));
    });

    return [...result];
  }, [enemyItem]);

  const randomRewardItems = React.useMemo(() => {
    const result: Set<Item> = new Set();

    if (enemyItem.randomRewards.length > 0) {
      enemyItem.randomRewards.map((rewardInfo) => {
        result.add(store.findEnemyById(rewardInfo.itemId));
      });
    }

    return [...result];
  }, [enemyItem]);

  return {
    rewardItems,
    hasRewardItems: rewardItems.length > 0,
    randomRewardItems,
    hasRandomRewardItems: randomRewardItems.length > 0,
  };
};

const useIsActiveBattleEnemyItem = (enemyItem: EnemyItem) => {
  const { battle } = core;
  return React.useMemo(() => battle.activeEnemyItem?.id === enemyItem.id, [battle.activeEnemyItem, enemyItem]);
};

export { useBattleEnemyItemRewards, useIsActiveBattleEnemyItem };
