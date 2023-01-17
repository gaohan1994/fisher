import { beforeEach, describe, expect, test } from 'vitest';
import { ItemType, NormalItem } from '../fisher-item';
import { Reward } from '../fisher-reward';
import { FisherCore } from '../fisher-core';
import { Store } from '../fisher-packages';
import { Backpack } from '../fisher-backpack';
import { Bank } from '../fisher-bank';

let store: Store;
let core: FisherCore;
let backpack: Backpack;
let bank: Bank;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
  backpack = core.backpack;
  backpack.items.clear();
  bank = core.bank;
});

const testSkillId = 'Forge';

const testItemPayload = {
  id: 'Test:Backpack',
  name: 'Test:BackpackItemName',
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
  type: ItemType.Test,
};

describe('FisherRewards', () => {
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
    const testItem = new NormalItem(testItemPayload);
    reward.addRewardItem(testItem, 1);
    expect(reward.rewardItemMap.size).toBe(1);
    expect(reward.rewardItemMap.has(testItem)).toBeTruthy();
    expect(reward.rewardItemMap.get(testItem)).toBe(1);

    reward.addRewardItem(testItem, 10);
    expect(reward.rewardItemMap.get(testItem)).toBe(11);
  });

  test('should success set reward skill experience to reward', () => {
    const reward = new Reward();

    reward.addRewardSkill(testSkillId, 10);
    expect(reward.rewardSkillExperience.size).toBe(1);
    expect(reward.rewardSkillExperience.get(testSkillId)).toBe(10);

    reward.addRewardSkill(testSkillId, 20);
    expect(reward.rewardSkillExperience.size).toBe(1);
    expect(reward.rewardSkillExperience.get(testSkillId)).toBe(10 + 20);
  });

  test('should clear rewards after reset reward data', () => {
    const reward = new Reward();
    const testItem = new NormalItem(testItemPayload);

    reward.addRewardItem(testItem, 1).addRewardGold(50).addRewardSkill(testSkillId, 10);
    reward.reset();

    expect(reward.rewardItemMap.size).toBe(0);
    expect(reward.rewardGold).toBe(0);
    expect(reward.rewardSkillExperience.size).toBe(0);
  });
});

describe('Reward interfaces', () => {
  test('should success use Reward.Create', () => {
    const reward = Reward.create({
      gold: 50,
      itemId: 'ClothHat',
      itemQuantity: 2,
      componentId: 'Forge',
      experience: 10,
    });
    expect(reward.rewardGold).toBe(50);

    const [clothHat, quantity] = reward.rewardItems[0];
    expect(clothHat).toStrictEqual(store.findEquipmentById('ClothHat'));
    expect(quantity).toBe(2);

    const [[componentId, experience]] = [...reward.rewardSkillExperience];
    expect(componentId).toBe('Forge');
    expect(experience).toBe(10);
  });

  test('should execute rewards', () => {
    const reward = new Reward();

    const testItem = new NormalItem(testItemPayload);
    const exsitItem = new NormalItem(Object.assign({}, testItemPayload, { id: 'Test:Item:2' }));
    backpack.addItem(exsitItem, 100);

    reward.addRewardGold(50).addRewardItem(testItem, 10).addRewardItem(exsitItem, -50).addRewardSkill(testSkillId, 10);

    reward.execute();
    expect(bank.gold).toBe(50);
    expect(backpack.items.get(testItem)?.quantity).toBe(10);
    expect(backpack.items.get(exsitItem)?.quantity).toBe(50);
    expect(core.forge.skill.experience.experience).toBe(10);

    reward.execute();
    expect(bank.gold).toBe(100);
    expect(backpack.items.get(testItem)?.quantity).toBe(20);
    expect(backpack.items.has(exsitItem)).toBeFalsy();
    expect(core.forge.skill.experience.experience).toBe(20);
  });
});
