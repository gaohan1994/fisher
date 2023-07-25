import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { Recipe } from '../../fisher-item';

const testRecipeData = {
  id: 'Mining:Recipe:FiveElementsStone',
  name: '五行矿石',
  desc: '采集五行晶石，有概率采集到伴生的五种属性的晶石',
  media: '',
  interval: 5000,
  unlockLevel: 1,
  rewardExperience: 50,
  rewardItems: [{ itemId: 'FiveElementsStone', itemQuantity: 1 }],
  randomRewardItems: [
    { probability: 10, itemId: 'MetalStone', itemQuantity: 1 },
    { probability: 10, itemId: 'WaterStone', itemQuantity: 1 },
    { probability: 10, itemId: 'WaterStone', itemQuantity: 1 },
    { probability: 10, itemId: 'FireStone', itemQuantity: 1 },
    { probability: 10, itemId: 'EarthStone', itemQuantity: 1 },
  ],
};

let core: FisherCore;

beforeEach(() => {
  core = FisherCore.create();
});

describe('RecipteItem', () => {
  test('should new Recipe item', () => {
    const recipe = new Recipe(testRecipeData);

    expect(recipe.interval).toBe(5000);

    expect(recipe.rewardItems.length).toBe(1);
    expect(recipe.rewardExperience).toBe(50);
    expect(recipe.randomRewardItems.length).toBe(5);

    expect(recipe.hasRewardItems).toBeTruthy();
    expect(recipe.hasExperienceReward).toBeTruthy();
    expect(recipe.hasRandomRewardItems).toBeTruthy();
  });
});
