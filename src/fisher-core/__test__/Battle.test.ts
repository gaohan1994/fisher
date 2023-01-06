/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { Battle } from '../fisher-battle';
import { Enemy, Master } from '../fisher-person';

describe('Battle', () => {
  test('should initialize Fisher battle', () => {
    const battle = new Battle();
    expect(battle.inBattle).toBeFalsy();
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

    expect(battle.master.initializedForBattle).toBeTruthy();
    expect(battle.enemy?.initializedForBattle).toBeTruthy();
    expect(battle.activeEnemyItem).toStrictEqual(enemyItem);
    expect(battle.enemy instanceof Enemy).toBeTruthy();
  });
});
