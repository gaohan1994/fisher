/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Store } from '../fisher-packages';
import { IRecipe, Recipe } from '../fisher-item';
import { Backpack } from '../fisher-backpack';
import { Skill } from '../fisher-skill';
import { FisherCore } from '../fisher-core';
import { experienceCalculator } from '../fisher-experience';

let store: Store;
let core: FisherCore;
let backpack: Backpack;
let skill: Skill;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
  backpack = core.backpack;
  backpack.items.clear();
  skill = core.mining.skill;
  skill.recipeHandler.resetActiveRecipe();
  skill.experience.setExperience(0);
});

const testRecipeData: IRecipe = {
  id: 'Mining:Recipe:LowSpiritMine',
  name: '低灵矿石',
  desc: '采集低灵矿石',
  media: '',
  interval: 1000,
  unlockLevel: 1,
  rewardExperience: 5,
  rewardItems: [{ itemId: 'LowSpiritMine', itemQuantity: 1 }],
  randomRewardItems: [{ probability: 100, itemId: 'EarthStone', itemQuantity: 1 }],
};

describe('Skill experience', () => {
  test('should success calculate experience', () => {
    expect(skill.experience.level).toBe(1);
    expect(skill.experience.levelUpExperience).toBe(experienceCalculator.getLevelExperience(1));

    skill.experience.receiveExperience(140);
    expect(skill.experience.level).toBe(2);
    expect(skill.experience.levelUpExperience).toBe(experienceCalculator.getLevelExperience(2));
  });

  test('should success return max level', () => {
    skill.experience.receiveExperience(1009899);
    expect(skill.experience.level).toBe(40);
    expect(skill.experience.levelUpExperience).toBe(experienceCalculator.getLevelExperience(40));

    skill.experience.receiveExperience(1009899);
    expect(skill.experience.level).toBe(40);
  });
});

describe('Skill', () => {
  describe('should calculate active recipe info', () => {
    test('active recipe should not available', () => {
      expect(skill.recipeHandler.activeRecipe).toBeUndefined();
      expect(skill.recipeHandler.hasActiveRecipe).toBeFalsy();
      expect(skill.recipeHandler.activeRecipeUnlockLevelAvailable).toBeFalsy();
      expect(skill.recipeHandler.activeRecipeBearCostAvailable).toBeTruthy();
      expect(skill.recipeHandler.activeRecipeAvailable).toBeFalsy();

      test('should not can bear cost', () => {
        const testRecipe = new Recipe(
          Object.assign({}, testRecipeData, {
            costItems: [{ itemId: 'LowSpiritMine', itemQuantity: 5 }],
          })
        );
        skill.setActiveRecipe(testRecipe);

        expect(skill.recipeHandler.hasActiveRecipe).toBeTruthy();
        expect(skill.recipeHandler.activeRecipeUnlockLevelAvailable).toBeTruthy();
        expect(skill.recipeHandler.activeRecipeBearCostAvailable).toBeFalsy();
        expect(skill.recipeHandler.activeRecipeAvailable).toBeFalsy();
      });
    });

    test('active recipe should available', () => {
      const testRecipe = new Recipe(testRecipeData);
      skill.setActiveRecipe(testRecipe);

      expect(skill.recipeHandler.hasActiveRecipe).toBeTruthy();
      expect(skill.recipeHandler.activeRecipeUnlockLevelAvailable).toBeTruthy();
      expect(skill.recipeHandler.activeRecipeBearCostAvailable).toBeTruthy();
      expect(skill.recipeHandler.activeRecipeAvailable).toBeTruthy();
    });

    test('should not require unlock level', () => {
      const testRecipe = new Recipe(Object.assign({}, testRecipeData, { unlockLevel: 2 }));
      skill.setActiveRecipe(testRecipe);
      expect(skill.recipeHandler.activeRecipeUnlockLevelAvailable).toBeFalsy();
      expect(skill.recipeHandler.activeRecipeAvailable).toBeFalsy();
    });
  });

  test('should success update active recipe when called updateActiveRecipe', () => {
    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    expect(skill.recipeHandler.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');
  });

  test('should replace active recipe when called updateActiveRecipe but already have one active recipe', () => {
    expect(skill.recipeHandler.activeRecipe).toBeUndefined();

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    expect(skill.recipeHandler.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');

    const testRecipeReplace = new Recipe({
      ...testRecipeData,
      id: 'Mining:Recipe:ReplaceTest',
    });
    skill.setActiveRecipe(testRecipeReplace);
    expect(skill.recipeHandler.activeRecipe?.id).toBe('Mining:Recipe:ReplaceTest');
  });

  test('should success receive experience rewards when start skill', () => {
    vi.useFakeTimers();

    expect(skill.experience.experience).toEqual(0);

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    skill.start();
    vi.advanceTimersByTime(testRecipe.interval);

    expect(skill.experience.experience).toEqual(testRecipe.rewardExperience);

    vi.clearAllTimers();
  });

  test('should success receive items rewards when start skill', () => {
    vi.useFakeTimers();

    const rewardItem = store.findItemById('LowSpiritMine');

    // clear backpack before run skill
    const rewardBackpackItem = backpack.items.get(rewardItem);
    if (rewardBackpackItem) {
      backpack.sellItem(rewardBackpackItem);
    }

    expect(backpack.items.has(rewardItem)).toBeFalsy();

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    skill.start();
    vi.advanceTimersByTime(testRecipe.interval);

    expect(backpack.items.has(rewardItem)).toBeTruthy();
    expect(backpack.backpackItems.find((item) => item.item.id === 'LowSpiritMine')?.quantity).toEqual(1);

    vi.advanceTimersByTime(testRecipe.interval);
    expect(backpack.backpackItems.find((item) => item.item.id === 'LowSpiritMine')?.quantity).toEqual(2);

    vi.clearAllTimers();
  });

  test('should success receive random items rewards when start skill', () => {
    vi.useFakeTimers();

    const rewardItem = store.findItemById('EarthStone');

    // clear backpack before run skill
    const rewardBackpackItem = backpack.items.get(rewardItem);
    if (rewardBackpackItem) {
      backpack.sellItem(rewardBackpackItem);
    }

    expect(backpack.items.has(rewardItem)).toBeFalsy();

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    skill.start();
    vi.advanceTimersByTime(testRecipe.interval);

    expect(backpack.items.has(rewardItem)).toBeTruthy();
    expect(backpack.backpackItems.find((item) => item.item.id === 'EarthStone')?.quantity).toEqual(1);

    vi.advanceTimersByTime(testRecipe.interval);
    expect(backpack.backpackItems.find((item) => item.item.id === 'EarthStone')?.quantity).toEqual(2);

    vi.clearAllTimers();
  });

  describe('Skill interface', () => {
    const costRecipe = new Recipe(
      Object.assign({}, testRecipeData, {
        costItems: [{ itemId: 'MetalStone', itemQuantity: 5 }],
      })
    );

    test('should throw error when try to start skill but recipe doesn"t available', () => {
      expect(() => {
        skill.setActiveRecipe(costRecipe);
        skill.start();
      }).toThrowError(`Try start recipe but can not bear costs`);
    });

    test('should stop skill timer when recipe unavailable ', () => {
      vi.useFakeTimers();

      const costItem = store.findItemById('MetalStone');
      core.backpack.addItem(costItem, 5);
      skill.setActiveRecipe(costRecipe);
      skill.start();

      vi.advanceTimersByTime(1001);

      expect(skill.timer.active).toBeFalsy();
      expect(skill.recipeHandler.activeRecipeAvailable).toBeFalsy();
      expect(core.backpack.checkItemById('MetalStone')).toBeFalsy();

      vi.clearAllTimers();
    });
  });
});
