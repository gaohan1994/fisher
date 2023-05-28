import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy } from '../../fisher-person';
import { ActionId, FisherActions } from '../../fisher-actions';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testPerson: IEnemyItem = {
  id: 'LowSpiritMonster2',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: 1,
};

describe('DebuffActions', () => {
  test('should success execute LowDebuffAttackPowerAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforePower = enemy.attributePanel.AttackPower;
    const action = new FisherActions.LowDebuffAttackPowerAction();
    expect(action.id).toEqual(ActionId.LowDebuffAttackPowerAction);

    action.execute(enemy.person);
    expect(enemy.actionManager.activeDebuffActions.includes(action)).toBeTruthy();
    expect(enemy.attributePanel.AttackPower).toEqual(
      beforePower + FisherActions.LowDebuffAttackPowerAction.AttackPower
    );

    action.abort();
    expect(enemy.actionManager.activeDebuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeDebuffActions.includes(action)).toBeFalsy();
    expect(enemy.attributePanel.AttackPower).toEqual(beforePower);

    vi.clearAllTimers();
  });
});
