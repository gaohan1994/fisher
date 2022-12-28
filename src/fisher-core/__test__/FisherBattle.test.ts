import { describe, expect, test, vi } from 'vitest';
import { FisherBattle } from '../fisher-battle';
import { Enemy, Master } from '../fisher-person';

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
  });

  test('should initialize for battle', async () => {
    vi.useFakeTimers();
    const battle = new FisherBattle();
    const enemyItem = battle.packages[0].enemies[0];
    await battle.start(enemyItem);

    expect(battle.inBattle).toBeTruthy();
    expect(battle.activeEnemyItem).toStrictEqual(enemyItem);
    expect(battle.enemy instanceof Enemy).toBeTruthy();
    vi.clearAllTimers();
  });
});