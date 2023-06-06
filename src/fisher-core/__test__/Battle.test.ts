/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Battle } from '../fisher-battle';
import { FisherCore } from '../fisher-core';
import { EnemyItem, EquipmentItem } from '../fisher-item';
import { Fight } from '../fisher-fight';
import { Master } from '../fisher-person';

let core: FisherCore;
let battle: Battle;
let master: Master;
beforeEach(() => {
  core = FisherCore.create();
  master = core.master;
  battle = core.battle;
});

describe('Battle', () => {
  test('should initialize Fisher battle', () => {
    expect(battle.fight).toBeUndefined();
    expect(battle.rewardPool.pool.length).toBe(0);
    expect(battle.rewardPool.hasReward).toBeFalsy();
    expect(() => battle.start()).toThrow(`Fail to start battle, please set active enemy`);
  });

  test('should set active enemy item and enemy loading status', async () => {
    vi.useFakeTimers();

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

    master.personEquipmentManager.useEquipment(debugWeapon);
    battle.setAcitveEnemyItem(testEnemyItem);
    battle.start();

    const spyAction = vi.fn().mockImplementation(async (_master, _enemy) => {
      expect(_master.id).toEqual('Master');
      expect(_enemy.id).toEqual('LowSpiritMonster');
    });

    battle.fight?.event.on(Fight.EventKeys.MasterWinFight, spyAction);

    expect(battle.rewardPool.hasReward).toBeFalsy();
    expect(battle.enemy!.id).toEqual(testEnemyItem.id);
    expect(master.person.isAttacking).toBeTruthy();
    expect(battle.enemy!.person.isAttacking).toBeTruthy();
    expect(core.activeComponent).toStrictEqual(battle);

    await vi.advanceTimersByTime(100);
    expect(spyAction).toBeCalled();
    expect(battle.rewardPool.hasReward).toBeTruthy();

    await vi.advanceTimersByTime(200);
    battle.stop();
    expect(master.person.isAttacking).toBeFalsy();
    expect(battle.fight).toBeUndefined();
    expect(battle.enemy).toBeUndefined();
    expect(battle.activeEnemyItem).toBeUndefined();

    vi.clearAllTimers();
  });
});
