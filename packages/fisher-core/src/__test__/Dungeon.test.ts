/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { DungeonItem, EnemyItem, EquipmentItem } from '../fisher-item';
import { Fight } from '../fisher-fight';
import { Dungeon } from '../fisher-dungeon';
import { NormalAttackAction } from '../fisher-actions/AttackActions';
import { Master } from '../fisher-person';
import { Store } from '../fisher-packages';

const debugWeapon = new EquipmentItem({
  id: 'DebugWeapon',
  name: 'DebugWeapon',
  desc: 'DebugWeapon',
  media: 'woodsword',
  price: 5,
  slot: 'PrimaryWeapon',
  attackSpeed: 100,
  attributes: [{ key: 'AttackPower', value: 99999 }],
});

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
  unlockLevel: 0,
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

let core: FisherCore;
let master: Master;
let dungeon: Dungeon;
let store: Store;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
  core.backpack.items.clear();
  master = core.master;
  dungeon = core.dungeon;
});

describe('Dungeon', () => {
  test('should initialize Dungeon module', () => {
    expect(dungeon.fight).toBeUndefined();
    expect(dungeon.master).toBeUndefined();
    expect(dungeon.rewardPool.pool.length).toBe(0);
    expect(dungeon.rewardPool.hasReward).toBeFalsy();
    expect(() => dungeon.start()).toThrowError('Fail to start dungeon, please set active dungeon');
  });

  test('should set active dungeon item and start dungeon', async () => {
    vi.useFakeTimers();

    expect(dungeon.activeDungeonItem).toBeUndefined();
    expect(dungeon.rewardPool.hasReward).toBeFalsy();
    const testDungeon = new DungeonItem(testDungeonData);

    dungeon.setActiveDungeonItem(testDungeon);
    master.personEquipmentManager.useEquipment(debugWeapon);

    const spyAction = vi.fn().mockImplementation(async (_master, _enemy) => {
      expect(_master.id).toEqual('Master');
      expect(_enemy.id).toEqual('LowSpiritMonster');
    });

    expect(dungeon.activeDungeonItem).toStrictEqual(testDungeon);

    dungeon.start();

    dungeon.fight!.event.on(Fight.EventKeys.MasterWinFight, spyAction);
    expect(dungeon.rewardPool.hasReward).toBeFalsy();
    expect(dungeon.activeDungeonItem?.progress).toBe(0);
    expect(core.backpack.checkItemById('NormalReiki')).toBeFalsy();
    expect(core.backpack.checkItemById('MetalStone')).toBeFalsy();
    expect(dungeon.enemy !== undefined).toBeTruthy();
    expect(dungeon.activeDungeonItem?.currentEnemyItem).toStrictEqual(new EnemyItem(enemy1));
    expect(core.activeComponent).toStrictEqual(dungeon);

    const normalAttackAction = new NormalAttackAction();
    normalAttackAction.execute(master.person);

    expect(spyAction).toBeCalled();
    await vi.advanceTimersByTime(200);

    // master should win the fight
    // the dungeon should fight with next enemy
    expect(dungeon.rewardPool.hasReward).toBeTruthy();
    expect(dungeon.activeDungeonItem?.progress).toBe(1);
    expect(dungeon.activeDungeonItem?.currentEnemyItem).toStrictEqual(new EnemyItem(enemy2));

    dungeon.executeRewards();
    expect(core.backpack.checkItemById('NormalReiki', 1)).toBeTruthy();
    expect(core.backpack.checkItemById('MetalStone', 1)).toBeTruthy();

    await vi.advanceTimersByTime(100 + 200);

    // re-fight the first boss
    expect(dungeon.activeDungeonItem?.progress).toBe(0);
    expect(dungeon.activeDungeonItem?.currentEnemyItem).toStrictEqual(new EnemyItem(enemy1));

    vi.clearAllTimers();
  });
});
