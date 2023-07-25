import { beforeEach, describe, expect, test } from 'vitest';
import { HangUpRecipeHandler } from '../fisher-hang-up';
import { Recipe } from '../fisher-item';
import { ComponentId, FisherCore } from '../fisher-core';
import { Backpack } from '../fisher-backpack';

let core: FisherCore;
let backpack: Backpack;
beforeEach(() => {
  core = FisherCore.create();
  backpack = core.backpack;
  backpack.items.clear();
});

describe('HangUpRecipeHandler', () => {
  test('should success create HangUpRecipeHandler', () => {
    const testNoCostRecipe = new Recipe({
      id: 'Mining:Recipe:DragonBloodMine',
      name: '采集：龙血矿',
      desc: '',
      media: '',
      interval: 5000,
      unlockLevel: 99,
      rewardExperience: 1000,
      rewardItems: [{ itemId: 'DragonBloodMine', itemQuantity: 1 }],
      randomRewardItems: [{ itemId: 'NormalReiki', itemQuantity: 1, probability: 50 }],
    });

    const hangUpRecipeHandler = new HangUpRecipeHandler(testNoCostRecipe);
    const rewardPool = hangUpRecipeHandler.createMultipleRewards(100, { componentId: ComponentId.Mining });

    expect(rewardPool.hasReward).toBe(true);
    rewardPool.executeRewardPool(false);

    expect(backpack.checkItemById('DragonBloodMine', 100));
    expect(backpack.checkItemById('NormalReiki', 50));
  });
});
