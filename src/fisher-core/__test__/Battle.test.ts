/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { Battle, BattleStatus } from '../fisher-battle';
import { Enemy, Master } from '../fisher-person';
import { FisherCore } from '../fisher-core';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Battle', () => {
  test('should initialize Fisher battle', () => {
    const battle = new Battle();
    expect(battle.isFighting).toBeFalsy();
    expect(battle.master instanceof Master).toBeTruthy();
    expect(battle.activeEnemyItem).toBeUndefined();
    expect(battle.enemy).toBeUndefined();
    expect(battle.battleCountMap.size).toBe(0);
    expect(battle.rewardPool.length).toBe(0);
    expect(battle.hasReward).toBeFalsy();
  });

  test('should initialize for battle', async () => {
    const battle = new Battle();
    const enemyItem = battle.packages[0].enemies[0];
    await battle.start(enemyItem);

    expect(battle.activeEnemyItem).toStrictEqual(enemyItem);
    expect(battle.enemy instanceof Enemy).toBeTruthy();
  });

  test('should success calculate battle status', () => {
    const battleStatus = new BattleStatus();
    expect(battleStatus.status === BattleStatus.IBattleStatus.Initial);
    expect(battleStatus.isInitial).toBe(true);

    battleStatus.fighting();
    expect(battleStatus.status === BattleStatus.IBattleStatus.Fighting);
    expect(battleStatus.isFighting).toBe(true);

    battleStatus.enemyLoading();
    expect(battleStatus.status === BattleStatus.IBattleStatus.EnemyLoading);
    expect(battleStatus.isEnemyLoading).toBe(true);
  });
});
