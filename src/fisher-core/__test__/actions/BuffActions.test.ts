import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy } from '../../fisher-person';
import { ActionId, LowBuffAttackPowerAction } from '../../fisher-actions';

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

describe('BuffActions', () => {
  test('should success execute LowBuffAttackPowerAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforeBuffAttackPower = enemy.attributePanel.AttackPower;
    const lowBuffAttackPowerAction = new LowBuffAttackPowerAction();
    expect(lowBuffAttackPowerAction.id).toEqual(ActionId.LowBuffAttackPowerAction);

    lowBuffAttackPowerAction.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(lowBuffAttackPowerAction)).toBeTruthy();
    expect(enemy.attributePanel.AttackPower).toEqual(beforeBuffAttackPower + LowBuffAttackPowerAction.AttackPower);

    lowBuffAttackPowerAction.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(lowBuffAttackPowerAction)).toBeFalsy();
    expect(enemy.attributePanel.AttackPower).toEqual(beforeBuffAttackPower);

    vi.clearAllTimers();
  });
});
