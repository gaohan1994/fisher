import { describe, expect, test, vi } from 'vitest';
import { FisherNormalItem, FisherRecipeItem } from '../fisher-item';
import { FisherSkill } from '../fisher-skill';

const payload = {
  id: 'Mining' as any,
  name: '采矿',
};
const testRewardItem = new FisherNormalItem({
  id: 'LowSpiritMine',
  name: '低灵矿',
  desc: '一种很常见的矿石，灵气和纯度较低',
  media: '',
  price: 5,
});
const testRecipeData = {
  id: 'Mining:Recipe:LowSpiritMine',
  name: '低灵矿',
  desc: '采集低灵矿',
  media: '',
  interval: 1000,
  unlockLevel: 1,
  rewardExperience: 20,
  rewardItem: testRewardItem,
  rewardQuantity: 1,
};

describe('FisherSkill', () => {
  test('should success initialize FisherSkill ', () => {
    const skill = new FisherSkill(payload);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.id).toMatch('Mining');
    expect(skill.activeRecipe).toBeUndefined();
  });

  test('should success calculate level experience info', () => {
    const skill = new FisherSkill(payload);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(140);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(140);
  });

  test('should success level up when add enough experience', () => {
    const skill = new FisherSkill(payload);
    expect(skill.levelInfo.level).toBe(1);
    skill.addExperience(139);
    expect(skill.levelInfo.level).toBe(1);
    skill.addExperience(1);
    expect(skill.levelInfo.level).toBe(2);
  });

  test('should success calculate level experience info when level up', () => {
    const skill = new FisherSkill(payload);
    expect(skill.levelInfo.level).toBe(1);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(140);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(140);

    skill.addExperience(140);
    expect(skill.levelInfo.level).toBe(2);
    expect(skill.levelInfo.totalExperienceToLevelUp).toBe(320);
    expect(skill.levelInfo.remainingExperienceToLevelUp).toBe(320 - 140);
  });

  test('should success update active recipe when called updateActiveRecipe', () => {
    const skill = new FisherSkill(payload);
    expect(skill.activeRecipe).toBeUndefined();
    const testRecipe = new FisherRecipeItem(testRecipeData);
    skill.updateActiveRecipe(testRecipe);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');
  });

  test('should replace active recipe when called updateActiveRecipe but already have one active recipe', () => {
    const skill = new FisherSkill(payload);
    expect(skill.activeRecipe).toBeUndefined();

    const testRecipe = new FisherRecipeItem(testRecipeData);
    skill.updateActiveRecipe(testRecipe);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:LowSpiritMine');

    const testRecipeReplace = new FisherRecipeItem({
      ...testRecipeData,
      id: 'Mining:Recipe:ReplaceTest',
    });
    skill.updateActiveRecipe(testRecipeReplace);
    expect(skill.activeRecipe?.id).toBe('Mining:Recipe:ReplaceTest');
  });

  test('should set correct timer and rewards when start skill', () => {
    vi.useFakeTimers();

    const skill = new FisherSkill(payload);
    const testRecipe = new FisherRecipeItem(testRecipeData);
    skill.updateActiveRecipe(testRecipe);
    skill.startAction();
    expect(skill.actionRewards.rewardItems.has(testRewardItem)).toBeTruthy();
    expect(skill.actionRewards.rewardItems.get(testRewardItem)).toBe(
      testRecipe.rewardQuantity
    );
    expect(skill.timerInterval).toBe(testRecipe.interval);

    vi.clearAllTimers();
  });
});
