import React from 'react';
import { DungeonItem, Item, core, store } from '@FisherCore';

const useDungeonItemRewards = (dungeonItem: DungeonItem) => {
  const rewardItems = React.useMemo(() => {
    const result: Set<Item> = new Set();

    dungeonItem.enemies.forEach((enemy) => {
      enemy.itemRewards.forEach((rewardInfo) => {
        result.add(store.findItemById(rewardInfo.itemId));
      });
    });

    return [...result];
  }, [dungeonItem]);

  const extraRewardItems = React.useMemo(() => {
    const result: Set<Item> = new Set();

    [...dungeonItem.progressExtraRewardMap].forEach(([_, rewardsInfo]) => {
      rewardsInfo.forEach((rewardInfo) => {
        if (!!rewardInfo.itemId) {
          result.add(store.findItemById(rewardInfo.itemId));
        }
      });
    });

    return [...result];
  }, [dungeonItem]);

  return {
    rewardItems,
    hasRewardItems: rewardItems.length > 0,
    extraRewardItems,
    hasExtraRewards: extraRewardItems.length > 0,
  };
};

const useIsActiveDungeonItem = (dungeonItem: DungeonItem) => {
  const { dungeon } = core;

  return React.useMemo(
    () => dungeon.activeDungeonItem?.id === dungeonItem.id,
    [dungeon.activeDungeonItem, dungeonItem]
  );
};

export { useDungeonItemRewards, useIsActiveDungeonItem };
