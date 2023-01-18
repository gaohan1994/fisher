/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Battle, BattleControl, BattleStatus } from '../fisher-battle';
import { Enemy } from '../fisher-person';
import { FisherCore } from '../fisher-core';
import { store } from '../fisher-packages';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Battle', () => {
  test('should initialize Fisher battle', () => {
    const battle = new Battle();
    expect(battle.battleControl instanceof BattleControl).toBeTruthy();
    expect(battle.battleStatus instanceof BattleStatus).toBeTruthy();
    expect(battle.rewardPool.pool.length).toBe(0);
    expect(battle.rewardPool.hasReward).toBeFalsy();
  });

  test('battle interfaces', async () => {
    const battle = new Battle();

    expect(battle.enemy).toBeUndefined();
    expect(() => {
      battle.start().catch((error) => {
        error.message === `Fail to start battle, please set active enemy item first`;
      });
    });
  });

  test('should set active enemy item and enemy loading status', () => {
    const battle = new Battle();
    expect(battle.isInitial).toBe(true);

    const enemyItem = store.findEnemyById('LowSpritMonster');
    battle.setEnemyItem(enemyItem);

    expect(battle.isEnemyLoading).toBe(true);
    expect(battle.enemy instanceof Enemy).toBeTruthy();
    expect(battle.enemy?.id === 'LowSpritMonster').toBeTruthy();

    test('start battle should success set fighting status and start attack actions and active component', () => {
      vi.useFakeTimers();
      battle.start();

      expect(battle.isFighting).toBeTruthy();
      expect(battle.master.person.isAttacking).toBeTruthy();
      expect(battle.enemy!.person.isAttacking).toBeTruthy();
      expect(core.activeComponent).toStrictEqual(battle);

      test('should set initial status and stop attack when stop battle', () => {
        battle.stop();
        expect(battle.isInitial).toBeTruthy();
        expect(battle.master.person.isAttacking).toBeFalsy();
        expect(battle.enemy!.person.isAttacking).toBeFalsy();
      });

      vi.clearAllTimers();
    });
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
