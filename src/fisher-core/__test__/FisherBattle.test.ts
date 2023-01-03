/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { FisherBattle } from '../fisher-battle';
import { Enemy, Master } from '../fisher-person';
import {
  ActionMode,
  NormalAttackAction,
} from '../fisher-person/person-actions';

describe('FisherBattle', () => {
  test('should initialize Fisher battle', () => {
    const battle = new FisherBattle();
    expect(battle.inBattle).toBeFalsy();
    expect(battle.master instanceof Master).toBeTruthy();
    expect(battle.activeEnemyItem).toBeUndefined();
    expect(battle.enemy).toBeUndefined();
    expect(battle.battleCountMap.size).toBe(0);
    expect(battle.rewardPool.length).toBe(0);
    expect(battle.hasReward).toBeFalsy();
    expect(
      battle.master.actionManager.normalAttackAction instanceof
        NormalAttackAction
    ).toBeTruthy();
    expect(
      battle.master.actionManager.actionMap.get(ActionMode.Dot)?.length
    ).toBeGreaterThan(0);
  });

  test('should initialize for battle', async () => {
    const battle = new FisherBattle();
    const enemyItem = battle.packages[0].enemies[0];
    await battle.start(enemyItem);

    expect(battle.master.initializedForBattle).toBeTruthy();
    expect(battle.enemy?.initializedForBattle).toBeTruthy();
    expect(battle.activeEnemyItem).toStrictEqual(enemyItem);
    expect(battle.enemy instanceof Enemy).toBeTruthy();
  });
});
