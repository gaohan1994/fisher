import { describe, expect, test, vi } from 'vitest';
import { FisherItem, FisherItemType } from '../fisher-item';
import { FisherReward } from '../fisher-reward';

const testItemPayload = {
  id: 'Test:Backpack',
  name: 'Test:BackpackItemName',
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
  type: FisherItemType.Test,
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

  test('should execute rewards', () => {
    const fisherReward = new FisherReward();
    const testFisherItem = new FisherItem(testItemPayload);
    fisherReward.addRewardItem(testFisherItem, 1).addRewardGold(50);
    fisherReward.executeRewards();
    expect(fisher.fisherGold.receiveGold).toBeCalled();
    expect(fisher.fisherBackpack.addItem).toBeCalled();
  });
});
