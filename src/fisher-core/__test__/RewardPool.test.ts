import { beforeEach, describe, expect, test } from 'vitest';
import { Bank } from '../fisher-bank';
import { FisherCore } from '../fisher-core';
import { Reward, RewardPool } from '../fisher-reward';

const reward = Reward.create({ gold: 5 });

let bank: Bank;
beforeEach(() => {
  const core = FisherCore.create();
  bank = core.bank;
  bank.clearGold();
});

describe('Reward pool', () => {
  test('should throw error when reward pool was empty but execute rewards', () => {
    const rewardPool = new RewardPool();
    expect(() => rewardPool.executeRewardPool()).toThrowError('Try to execute rewards but reward pool was empty');
  });

  test('should add reward to pool', () => {
    const rewardPool = new RewardPool();
    expect(rewardPool.pool.length).toBe(0);

    rewardPool.collectRewards([reward]);
    expect(rewardPool.hasReward).toBeTruthy();
    expect(rewardPool.pool.length).toBe(1);

    rewardPool.collectRewards([reward]);
    expect(rewardPool.pool.length).toBe(2);

    test('should success execute rewards', () => {
      rewardPool.executeRewardPool();
      expect(bank.gold).toBe(10);

      expect(rewardPool.pool.length).toBe(0);
      expect(rewardPool.hasReward).toBeFalsy();
    });
  });
});
