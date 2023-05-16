import { describe, expect, test } from 'vitest';
import { DungeonItem, EnemyItem } from '../../fisher-item';
import { Enemy } from '../../fisher-person';

const enemy1 = {
  id: 'LowSpiritMonster',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: 'LowSpiritMonster',
  level: 1,
  goldReward: 1,
  itemRewards: [{ itemId: 'NormalReiki' }],
};

const enemy2 = {
  id: 'FireSpiritMonster',
  name: '火灵小妖',
  desc: '灵力较低的小妖怪，常出现在火源丰富的地界',
  media: 'FireSpiritMonster',
  level: 5,
  unlockLevel: 5,
  goldReward: 5,
  itemRewards: [{ itemId: 'NormalReiki' }],
  randomRewards: [{ itemId: 'ClothHat', probability: 10 }],
};

const testDungeonData = {
  id: 'test:dungeon',
  name: '测试副本',
  desc: '测试副本',
  media: '',
  enemies: [enemy1, enemy2],
  progressExtraReward: {
    '0': [
      {
        itemId: 'MetalStone',
        itemQuantity: 1,
      },
    ],
    '1': [
      {
        itemId: 'FiveElementsStone',
        itemQuantity: 1,
      },
    ],
  },
};

describe('DungeonItem', () => {
  test('should success create a dungeon item', () => {
    const dungeonItem = new DungeonItem(testDungeonData);
    expect(dungeonItem.progress).toEqual(0);
    expect(dungeonItem.enemiesNumber).toEqual(2);
    expect(dungeonItem.progressExtraRewardMap.size).toEqual(2);
    expect(dungeonItem.currentEnemyItem.id).toEqual('LowSpiritMonster');

    dungeonItem.nextEnemy();

    expect(dungeonItem.progress).toEqual(1);
    expect(dungeonItem.currentEnemyItem.id).toEqual('FireSpiritMonster');

    const reward = dungeonItem.tryGetProgressExtraReward(new Enemy(new EnemyItem(enemy1)));
    expect(reward![0].hasRewardItems).toBeTruthy();
  });

  test('should return undefined if enemy does not have extra reward', () => {
    const dungeonItem = new DungeonItem(
      Object.assign({}, testDungeonData, {
        progressExtraReward: {
          '1': [
            {
              itemId: 'FiveElementsStone',
              itemQuantity: 1,
            },
          ],
        },
      })
    );

    const reward = dungeonItem.tryGetProgressExtraReward(new Enemy(new EnemyItem(enemy1)));
    expect(reward).toBeUndefined();
  });
});
