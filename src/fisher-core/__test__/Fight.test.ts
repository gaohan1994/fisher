/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Enemy, Master } from '../fisher-person';
import { FisherCore } from '../fisher-core';
import { Fight } from '../fisher-fight';
import { EnemyItem, EquipmentItem, EquipmentSlot } from '../fisher-item';

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
const testEnemy = new Enemy(
  new EnemyItem({
    id: 'LowSpiritMonster',
    name: '水灵小妖',
    desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
    media: 'LowSpiritMonster',
    level: 1,
    goldReward: 1,
    itemRewards: [{ itemId: 'NormalReiki' }],
  })
);

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Fight', () => {
  test('should throw FisherFightError when try stop fight without enemy', () => {
    const fight = new Fight();
    expect(() => {
      fight.stopFighting();
    }).toThrowError('Please set enemy first');
  });

  test('should success stop fight', () => {
    vi.useFakeTimers();

    const fight = new Fight();
    fight.startFighting(testEnemy);

    expect(fight.info.enemy instanceof Enemy).toBeTruthy();
    expect(fight.info.master.person.target).toStrictEqual(testEnemy.person);
    expect(fight.info.enemy?.person.target !== undefined).toBeTruthy();
    expect(fight.info.isAttacking).toBeTruthy();

    vi.advanceTimersByTime(50);
    fight.stopFighting();
    expect(fight.info.master.person.target).toBeUndefined();
    expect(fight.info.enemy).toBeUndefined();

    expect(fight.info.isAttacking).toBeFalsy();

    vi.clearAllTimers();
  });

  test('should success start fight', () => {
    vi.useFakeTimers();

    const spyAction = vi.fn().mockImplementation((_master, _enemy) => {
      expect(_master instanceof Master).toBeTruthy();
      expect(_enemy instanceof Enemy).toBeTruthy();
    });
    core.master.person.personEquipmentManager.useEquipment(debugWeapon);
    const fight = new Fight();
    fight.event.on(Fight.EventKeys.MasterWinFight, spyAction);

    expect(fight.info.isAttacking).toBeFalsy();

    fight.startFighting(testEnemy);

    expect(fight.info.isAttacking).toBeTruthy();

    vi.advanceTimersByTime(100);

    expect(spyAction).toBeCalled();
    expect(fight.info.isAttacking).toBeFalsy();

    core.master.personEquipmentManager.removeEquipment(EquipmentSlot.PrimaryWeapon);
    vi.clearAllTimers();
  });
});
