import { describe, expect, test } from 'vitest';
import { ItemType, NormalItem } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { Reward } from '../fisher-reward';
import { bank } from '../fisher-bank';
import { backpack } from '../fisher-backpack';

const testItemPayload = {
  id: 'Test:Backpack',
  name: 'Test:BackpackItemName',
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
  type: ItemType.Test,
};

const testSkillId = 'Test:Skill';

describe('FisherRewards', () => {
  test('should initialize Reward', () => {
    const reward = new Reward();
    expect(reward.rewardGold).toBe(0);
    expect(reward.rewardItemMap.size).toBe(0);
  });

  test('should success set rewardGold to reward', () => {
    const reward = new Reward();
    expect(reward.hasRewardGold).toBeFalsy();
    reward.addRewardGold(50);
    expect(reward.rewardGold).toBe(50);
    reward.addRewardGold(50);
    expect(reward.rewardGold).toBe(100);
  });

  test('should success set reward items to reward', () => {
    const reward = new Reward();
    expect(reward.hasRewardItems).toBeFalsy();
    const testFisherItem = new NormalItem(testItemPayload);
    reward.addRewardItem(testFisherItem, 1);
    expect(reward.rewardItemMap.size).toBe(1);
    expect(reward.rewardItemMap.has(testFisherItem)).toBeTruthy();
    expect(reward.rewardItemMap.get(testFisherItem)).toBe(1);

    reward.addRewardItem(testFisherItem, 10);
    expect(reward.rewardItemMap.get(testFisherItem)).toBe(11);
  });

  test('should success set reward skill experience to reward', () => {
    const reward = new Reward();
    const testFisherSkill = new Skill(testSkillId);
    reward.addRewardSkill(testFisherSkill, 10);
    expect(reward.rewardSkillExperience.size).toBe(1);
    expect(reward.rewardSkillExperience.get(testFisherSkill)).toBe(10);
    reward.addRewardSkill(testFisherSkill, 20);
    expect(reward.rewardSkillExperience.size).toBe(1);
    expect(reward.rewardSkillExperience.get(testFisherSkill)).toBe(10 + 20);
  });

  test('should success set correct value if use set method ', () => {
    const reward = new Reward();
    const testFisherItem = new NormalItem(testItemPayload);
    const testFisherSkill = new Skill(testSkillId);
    reward.setRewardItem(testFisherItem, 10);
    reward.setRewardItem(testFisherItem, 100);
    expect(reward.rewardItemMap.get(testFisherItem)).toBe(100);

    reward.setRewardGold(50);
    reward.setRewardGold(100);
    expect(reward.rewardGold).toBe(100);

    reward.setRewardSkill(testFisherSkill, 10);
    reward.setRewardSkill(testFisherSkill, 20);
    expect(reward.rewardSkillExperience.get(testFisherSkill)).toBe(20);
  });

  test('should execute rewards', () => {
    const reward = new Reward();

    const testFisherItem = new NormalItem(testItemPayload);
    const testFisherSkill = new Skill(testSkillId);
    reward.addRewardItem(testFisherItem, 1).addRewardGold(50).addRewardSkill(testFisherSkill, 10);

    reward.executeRewards();
    expect(bank.gold).toBe(50);
    expect(backpack.items.has(testFisherItem)).toBeTruthy();
    expect(testFisherSkill.experience).toBe(10);

    reward.executeRewards();
    expect(bank.gold).toBe(100);
    expect(testFisherSkill.experience).toBe(20);
  });

  test('should clear rewards after reset reward data', () => {
    const reward = new Reward();
    const testFisherItem = new NormalItem(testItemPayload);
    const testFisherSkill = new Skill(testSkillId);
    reward.addRewardItem(testFisherItem, 1).addRewardGold(50).addRewardSkill(testFisherSkill, 10);
    reward.resetRewards();
    expect(reward.rewardItemMap.size).toBe(0);
    expect(reward.rewardGold).toBe(0);
    expect(reward.rewardSkillExperience.size).toBe(0);
  });
});

describe('Reward interfaces', () => {
  test('should create rewards by interface', () => {
    const reward = Reward.create({ gold: 50, itemId: 'ClothHat' });
    expect(reward instanceof Reward).toBeTruthy();
    expect(reward.rewardGold).toBe(50);
    expect(reward.rewardItemMap.size).toBe(1);
    expect(reward.rewardItems.length).toBe(1);
    expect(reward.rewardItems[0][0].id).toBe('ClothHat');
  });
});
