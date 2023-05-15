/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Battle } from '../fisher-battle';
import { FisherCore } from '../fisher-core';
import { EnemyItem, EquipmentItem } from '../fisher-item';
import { Fight } from '../fisher-fight';

const debugWeapon = new EquipmentItem({
  id: 'DebugWeapon',
  name: 'DebugWeapon',
  desc: 'DebugWeapon',
  media: 'woodsword',
  price: 5,
  slot: 'PrimaryWeapon',
  attackSpeed: 100,
  attributes: [{ key: 'AttackPower', value: 4000 }],
});
const testEnemyItem = new EnemyItem({
  id: 'LowSpiritMonster',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: 'LowSpiritMonster',
  level: 1,
  goldReward: 1,
  itemRewards: [{ itemId: 'NormalReiki' }],
});

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Battle', () => {
  test('should initialize Fisher battle', () => {
    const battle = new Battle();
    expect(battle.fight instanceof Fight).toBeTruthy();
    expect(battle.rewardPool.pool.length).toBe(0);
    expect(battle.rewardPool.hasReward).toBeFalsy();
    expect(() => {
      battle.start().catch((error) => {
        error.message === `Fail to start battle, please set active enemy item first`;
      });
    });
  });

  test('should set active enemy item and enemy loading status', () => {
    const battle = new Battle();
    battle.master.personEquipmentManager.useEquipment(debugWeapon);
    battle.setAcitveEnemyItem(testEnemyItem);

    vi.useFakeTimers();
    battle.start();

    expect(battle.rewardPool.hasReward).toBeFalsy();
    expect(battle.enemy!.id).toEqual(testEnemyItem.id);
    expect(battle.master.person.isAttacking).toBeTruthy();
    expect(battle.enemy!.person.isAttacking).toBeTruthy();
    expect(core.activeComponent).toStrictEqual(battle);

    vi.advanceTimersByTime(100);

    expect(battle.rewardPool.hasReward).toBeTruthy();
    battle.rewardPool.executeRewardPool();
    expect(core.backpack.checkItemById('NormalReiki', 1)).toBeTruthy();

    battle.stop();
    expect(battle.master.person.isAttacking).toBeFalsy();
    expect(battle.enemy!.person.isAttacking).toBeFalsy();

    vi.clearAllTimers();
  });
});
