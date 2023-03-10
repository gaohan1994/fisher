import { beforeEach, describe, expect, test } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { Bank } from '../fisher-bank';
import { FisherCore } from '../fisher-core';
import { RewardChest } from '../fisher-item';
import { Mining } from '../fisher-modules';
import { RewardChestHandler } from '../fisher-reward';

const testChestItem = {
  id: 'NoobChest',
  name: '新手宝箱',
  desc: '给新手提供的宝箱，内含一套新手装备',
  media: 'ChestNormal',
  price: 1,
  rewardItems: [
    {
      itemId: 'WoodSword',
      itemQuantity: 1,
    },
    {
      itemId: 'NoobDagger',
      itemQuantity: 1,
    },
    {
      itemId: 'ClothHat',
      itemQuantity: 1,
    },
  ],
};

let bank: Bank;
let backpack: Backpack;
let mining: Mining;
beforeEach(() => {
  const core = FisherCore.create();
  bank = core.bank;
  bank.clearGold();
  backpack = core.backpack;
  backpack.items.clear();
  mining = core.mining;
  mining.setExperience(0);
});

describe('Reward chest handler', () => {
  test('should success open reward chest', () => {
    const chest = new RewardChest(testChestItem);

    expect(backpack.checkItemById('WoodSword')).toBeFalsy();
    expect(backpack.checkItemById('NoobDagger')).toBeFalsy();
    expect(backpack.checkItemById('ClothHat')).toBeFalsy();

    RewardChestHandler.openRewardChest(chest);

    expect(backpack.checkItemById('WoodSword')).toBeTruthy();
    expect(backpack.checkItemById('NoobDagger')).toBeTruthy();
    expect(backpack.checkItemById('ClothHat')).toBeTruthy();

    const chestWithGold = new RewardChest(Object.assign({}, testChestItem, { rewardGold: 5000 }));
    expect(bank.gold).toEqual(0);
    RewardChestHandler.openRewardChest(chestWithGold);
    expect(bank.gold).toEqual(5000);

    const chestWithExperience = new RewardChest(
      Object.assign({}, testChestItem, { rewardSkill: { componentId: 'Mining', experience: 10 } })
    );
    expect(mining.experience).toEqual(0);
    RewardChestHandler.openRewardChest(chestWithExperience);
    expect(mining.experience).toEqual(10);
  });

  test('should success open reward chest in batches', () => {
    const chest = new RewardChest(testChestItem);
    expect(backpack.checkItem(chest, 1)).toBeFalsy();
    backpack.addItem(chest, 10);

    RewardChestHandler.openRewardChestBatches(chest, 5);

    expect(backpack.checkItemById('WoodSword', 5)).toBeTruthy();
    expect(backpack.checkItemById('NoobDagger', 5)).toBeTruthy();
    expect(backpack.checkItemById('ClothHat', 5)).toBeTruthy();
    expect(backpack.getItem(chest)?.quantity).toEqual(5);

    RewardChestHandler.openRewardChestBatches(chest, 5);

    expect(backpack.checkItemById('WoodSword', 10)).toBeTruthy();
    expect(backpack.checkItemById('NoobDagger', 10)).toBeTruthy();
    expect(backpack.checkItemById('ClothHat', 10)).toBeTruthy();
    expect(backpack.checkItem(chest)).toBeFalsy();
  });
});
