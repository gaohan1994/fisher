import { describe, expect, test, vi } from 'vitest';
import { FisherItem, FisherItemType } from '../fisher-item';
import { FisherReward } from '../fisher-reward';
import { FisherSkill } from '../fisher-skill';

const testItemPayload = {
  id: 'Test:Backpack',
  name: 'Test:BackpackItemName',
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
  type: FisherItemType.Test,
};

const testSkillPayload = {
  id: 'Test:RewardSkill',
  name: 'Test:RewardSkill',
  experience: 0,
};

const fisherGold = {
  receiveGold: vi.fn(),
};

const fisherBackpack = {
  addItem: vi.fn(),
};

vi.stubGlobal('fisher', { fisherGold, fisherBackpack });

describe('FisherRewards', () => {
  test('should initialize FisherReward', () => {
    const fisherReward = new FisherReward();
    expect(fisherReward.rewardGold).toBe(0);
    expect(fisherReward.rewardItems.size).toBe(0);
  });

  test('should success set rewardGold to reward', () => {
    const fisherReward = new FisherReward();
    fisherReward.addRewardGold(50);
    expect(fisherReward.rewardGold).toBe(50);
    fisherReward.addRewardGold(50);
    expect(fisherReward.rewardGold).toBe(100);
  });

  test('should success set reward items to reward', () => {
    const fisherReward = new FisherReward();
    const testFisherItem = new FisherItem(testItemPayload);
    fisherReward.addRewardItem(testFisherItem, 1);
    expect(fisherReward.rewardItems.size).toBe(1);
    expect(fisherReward.rewardItems.has(testFisherItem)).toBeTruthy();
    expect(fisherReward.rewardItems.get(testFisherItem)).toBe(1);

    fisherReward.addRewardItem(testFisherItem, 10);
    expect(fisherReward.rewardItems.get(testFisherItem)).toBe(11);
  });

  test('should success set reward skill experience to reward', () => {
    const fisherReward = new FisherReward();
    const testFisherSkill = new FisherSkill(testSkillPayload);
    fisherReward.addRewardSkill(testFisherSkill, 10);
    expect(fisherReward.rewardSkillExperience.size).toBe(1);
    expect(fisherReward.rewardSkillExperience.get(testFisherSkill)).toBe(10);
    fisherReward.addRewardSkill(testFisherSkill, 20);
    expect(fisherReward.rewardSkillExperience.size).toBe(1);
    expect(fisherReward.rewardSkillExperience.get(testFisherSkill)).toBe(
      10 + 20
    );
  });

  test('should success set correct value if use set method ', () => {
    const fisherReward = new FisherReward();
    const testFisherItem = new FisherItem(testItemPayload);
    const testFisherSkill = new FisherSkill(testSkillPayload);
    fisherReward.setRewardItem(testFisherItem, 10);
    fisherReward.setRewardItem(testFisherItem, 100);
    expect(fisherReward.rewardItems.get(testFisherItem)).toBe(100);

    fisherReward.setRewardGold(50);
    fisherReward.setRewardGold(100);
    expect(fisherReward.rewardGold).toBe(100);

    fisherReward.setRewardSkill(testFisherSkill, 10);
    fisherReward.setRewardSkill(testFisherSkill, 20);
    expect(fisherReward.rewardSkillExperience.get(testFisherSkill)).toBe(20);
  });

  test('should execute rewards', () => {
    const fisherReward = new FisherReward();
    const testFisherItem = new FisherItem(testItemPayload);
    const testFisherSkill = new FisherSkill(testSkillPayload);
    fisherReward
      .addRewardItem(testFisherItem, 1)
      .addRewardGold(50)
      .addRewardSkill(testFisherSkill, 10);
    fisherReward.executeRewards();
    expect(fisher.fisherGold.receiveGold).toBeCalled();
    expect(fisher.fisherBackpack.addItem).toBeCalled();
    expect(testFisherSkill.experience).toBe(10);
    fisherReward.executeRewards();
    expect(fisher.fisherGold.receiveGold).toBeCalled();
    expect(fisher.fisherBackpack.addItem).toBeCalled();
    expect(testFisherSkill.experience).toBe(20);
  });

  test('should clear rewards after reset reward data', () => {
    const fisherReward = new FisherReward();
    const testFisherItem = new FisherItem(testItemPayload);
    const testFisherSkill = new FisherSkill(testSkillPayload);
    fisherReward
      .addRewardItem(testFisherItem, 1)
      .addRewardGold(50)
      .addRewardSkill(testFisherSkill, 10);
    fisherReward.resetRewards();
    expect(fisherReward.rewardItems.size).toBe(0);
    expect(fisherReward.rewardGold).toBe(0);
    expect(fisherReward.rewardSkillExperience.size).toBe(0);
  });
});
