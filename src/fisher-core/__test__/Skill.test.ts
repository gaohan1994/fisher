import { beforeEach, describe, expect, test, vi } from 'vitest';
import { IRecipe, Recipe } from '../fisher-item';
import { Backpack } from '../fisher-backpack';
import { store } from '../fisher-packages';
import { Skill } from '../fisher-skill';
import { FisherCore } from '../fisher-core';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testSkillId = 'Test:Skill';

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

describe('Skill', () => {
  test('should success initialize Skill ', () => {
    const skill = new Skill(testSkillId);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.id).toMatch(testSkillId);
    expect(skill.activeRecipe).toBeUndefined();
  });

  test('should success calculate level experience info', () => {
    const skill = new Skill(testSkillId);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(140);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(140);
  });

  test('should success level up when add enough experience', () => {
    const skill = new Skill(testSkillId);
    expect(skill.levelInfo.level).toBe(1);
    skill.addExperience(139);
    expect(skill.levelInfo.level).toBe(1);
    skill.addExperience(1);
    expect(skill.levelInfo.level).toBe(2);
  });

  test('should success calculate level experience info when level up', () => {
    const skill = new Skill(testSkillId);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(140);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(140);

    skill.addExperience(140);
    expect(skill.levelInfo.level).toBe(2);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(320);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(320 - 140);
  });

  describe('should calculate active recipe info', () => {
    const skill = new Skill(testSkillId);
    test('active recipe should not available', () => {
      expect(skill.activeRecipe).toBeUndefined();
      expect(skill.hasActiveRecipe).toBeFalsy();
      expect(skill.activeRecipeUnlockLevelRequirement).toBeFalsy();
      expect(skill.activeRecipeBearCostAvailable).toBeFalsy();
      expect(skill.activeRecipeAvailable).toBeFalsy();
    });

    test('active recipe should available', () => {
      const testRecipe = new Recipe(testRecipeData);
      skill.setActiveRecipe(testRecipe);

      expect(skill.hasActiveRecipe).toBeTruthy();
      expect(skill.activeRecipeUnlockLevelRequirement).toBeTruthy();
      expect(skill.activeRecipeBearCostAvailable).toBeTruthy();
      expect(skill.activeRecipeAvailable).toBeTruthy();
    });

    test('should not require unlock level', () => {
      const testRecipe = new Recipe(Object.assign({}, testRecipeData, { unlockLevel: 2 }));
      skill.setActiveRecipe(testRecipe);
      expect(skill.activeRecipeUnlockLevelRequirement).toBeFalsy();
      expect(skill.activeRecipeAvailable).toBeFalsy();
    });
  });

  test('should success update active recipe when called updateActiveRecipe', () => {
    const skill = new Skill(testSkillId);
    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');
  });

  test('should replace active recipe when called updateActiveRecipe but already have one active recipe', () => {
    const skill = new Skill(testSkillId);
    expect(skill.activeRecipe).toBeUndefined();

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');

    const testRecipeReplace = new Recipe({
      ...testRecipeData,
      id: 'Mining:Recipe:ReplaceTest',
    });
    skill.setActiveRecipe(testRecipeReplace);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:ReplaceTest');
  });

  test('should success receive experience rewards when start skill', () => {
    vi.useFakeTimers();

    const skill = new Skill(testSkillId);
    expect(skill.experience).toEqual(0);

    const testRecipe = new Recipe(testRecipeData);
    skill.setActiveRecipe(testRecipe);
    skill.start();
    vi.advanceTimersByTime(testRecipe.interval);

    expect(skill.experience).toEqual(testRecipe.rewardExperience);

    vi.clearAllTimers();
  });

  test('should success receive items rewards when start skill', () => {
    vi.useFakeTimers();

    const rewardItem = store.findItemById('LowSpiritMine');

    const skill = new Skill(testSkillId);
    const backpack = Backpack.create();

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

    const skill = new Skill(testSkillId);
    const backpack = Backpack.create();

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
});
