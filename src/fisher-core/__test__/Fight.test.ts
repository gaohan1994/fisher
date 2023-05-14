/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Enemy, Master } from '../fisher-person';
import { FisherCore } from '../fisher-core';
import { Fight } from '../fisher-fight';
import { EnemyItem, EquipmentItem } from '../fisher-item';

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
  test('should success start fight', () => {
    vi.useFakeTimers();

    let winner: any = undefined;
    let loser: any = undefined;
    let isMasterWin = false;

    const spyAction = vi.fn().mockImplementation((result) => {
      winner = result.winner;
      loser = result.loser;
      isMasterWin = result.isMasterWin;
    });
    Master.create().person.personEquipmentManager.useEquipment(debugWeapon);
    const fight = new Fight(testEnemy);
    fight.event.on(Fight.EventKeys.FightEnd, spyAction);

    expect(fight.info.isAttacking).toBeFalsy();
    expect(fight.info.isAttacking).toBeFalsy();

    fight.startFighting();

    expect(fight.info.isAttacking).toBeTruthy();
    expect(fight.info.isAttacking).toBeTruthy();

    vi.advanceTimersByTime(100);

    expect(spyAction).toBeCalled();
    expect(fight.info.isAttacking).toBeFalsy();
    expect(fight.info.isAttacking).toBeFalsy();
    expect(winner instanceof Master).toBeTruthy();
    expect(loser instanceof Enemy).toBeTruthy();
    expect(isMasterWin).toBeTruthy();

    vi.clearAllTimers();
  });

  test('should success stop fight', () => {
    vi.useFakeTimers();
    const spyAction = vi.fn();
    const fight = new Fight(testEnemy);
    fight.event.on(Fight.EventKeys.FightEnd, spyAction);

    fight.startFighting();

    expect(fight.info.isAttacking).toBeTruthy();
    expect(fight.info.isAttacking).toBeTruthy();

    vi.advanceTimersByTime(50);
    fight.stopFighting();

    expect(fight.info.isAttacking).toBeFalsy();
    expect(fight.info.isAttacking).toBeFalsy();

    vi.clearAllTimers();
  });
});
