/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Battle } from '../fisher-battle';
import { FisherCore } from '../fisher-core';
import { EnemyItem, EquipmentItem } from '../fisher-item';
import { Fight } from '../fisher-fight';
import { Enemy, Master } from '../fisher-person';

const debugWeapon = new EquipmentItem({
  id: 'DebugWeapon',
  name: 'DebugWeapon',
  desc: 'DebugWeapon',
  media: 'woodsword',
  price: 5,
  slot: 'PrimaryWeapon',
  attackSpeed: 100,
  attributes: [{ key: 'AttackPower', value: 9999 }],
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
    expect(() => battle.start()).toThrow(`Fail to start battle, please set active enemy`);
  });

  test('should set active enemy item and enemy loading status', async () => {
    vi.useFakeTimers();

    const battle = new Battle();

    const spyAction = vi.fn().mockImplementation(async (_master, _enemy) => {
      expect(_master instanceof Master).toBeTruthy();
      expect(_enemy instanceof Enemy).toBeTruthy();
    });

    battle.fight.event.on(Fight.EventKeys.MasterWinFight, spyAction);
    battle.master.personEquipmentManager.useEquipment(debugWeapon);
    battle.setAcitveEnemyItem(testEnemyItem);
    battle.start();

    expect(battle.rewardPool.hasReward).toBeFalsy();
    expect(battle.enemy!.id).toEqual(testEnemyItem.id);
    expect(battle.master.person.isAttacking).toBeTruthy();
    expect(battle.enemy!.person.isAttacking).toBeTruthy();
    expect(core.activeComponent).toStrictEqual(battle);

    await vi.advanceTimersByTime(100);
    expect(spyAction).toBeCalled();
    expect(battle.rewardPool.hasReward).toBeTruthy();

    await vi.advanceTimersByTime(200);
    battle.stop();
    expect(battle.master.person.isAttacking).toBeFalsy();
    expect(battle.enemy).toBeUndefined();
    expect(battle.activeEnemyItem).toBeUndefined();

    vi.clearAllTimers();
  });
});
