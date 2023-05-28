import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { Enemy } from '../../fisher-person';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
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

describe('BuffActions', () => {
  test('should success execute LowBuffAttackPowerAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforeBuffAttackPower = enemy.attributePanel.AttackPower;
    const lowBuffAttackPowerAction = new FisherActions.LowBuffAttackPowerAction();
    expect(lowBuffAttackPowerAction.id).toEqual(ActionId.LowBuffAttackPowerAction);

    lowBuffAttackPowerAction.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(lowBuffAttackPowerAction)).toBeTruthy();
    expect(enemy.attributePanel.AttackPower).toEqual(
      beforeBuffAttackPower + FisherActions.LowBuffAttackPowerAction.AttackPower
    );

    lowBuffAttackPowerAction.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(lowBuffAttackPowerAction)).toBeFalsy();
    expect(enemy.attributePanel.AttackPower).toEqual(beforeBuffAttackPower);

    vi.clearAllTimers();
  });

  test('should success execute LowBuffAttackPowerMultiplierAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforeBuffAttackPower = enemy.attributePanel.AttackPower;
    const beforeBuffDefencePower = enemy.attributePanel.DefencePower;
    const action = new FisherActions.LowBuffAttackPowerMultiplierAction();
    expect(action.id).toEqual(ActionId.LowBuffAttackPowerMultiplierAction);

    action.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeTruthy();
    expect(enemy.person.attributePanel.BonusAttackPowerMultiplier).toEqual(
      1 + FisherActions.LowBuffAttackPowerMultiplierAction.AttackPowerMultiplier
    );
    expect(enemy.person.attributePanel.BonusDefencePowerMultiplier).toEqual(
      1 + FisherActions.LowBuffAttackPowerMultiplierAction.DefencePowerMultiplier
    );
    expect(enemy.person.attributePanel.AttackPower).toEqual(
      beforeBuffAttackPower * (1 + FisherActions.LowBuffAttackPowerMultiplierAction.AttackPowerMultiplier)
    );
    expect(enemy.person.attributePanel.DefencePower).toEqual(
      beforeBuffDefencePower * (1 + FisherActions.LowBuffAttackPowerMultiplierAction.DefencePowerMultiplier)
    );

    action.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeFalsy();
    expect(enemy.person.attributePanel.BonusAttackPowerMultiplier).toEqual(1);
    expect(enemy.person.attributePanel.BonusDefencePowerMultiplier).toEqual(1);
    expect(enemy.person.attributePanel.AttackPower).toEqual(beforeBuffAttackPower);
    expect(enemy.person.attributePanel.DefencePower).toEqual(beforeBuffDefencePower);

    vi.clearAllTimers();
  });

  test('should success execute LowBuffDefencePowerAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforeBuffDefencePower = enemy.attributePanel.DefencePower;
    const action = new FisherActions.LowBuffDefencePowerAction();
    expect(action.id).toEqual(ActionId.LowBuffDefencePowerAction);

    action.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeTruthy();
    expect(enemy.person.attributePanel.BonusDefencePower).toEqual(FisherActions.LowBuffDefencePowerAction.DefencePower);

    action.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeFalsy();
    expect(enemy.person.attributePanel.BonusDefencePower).toEqual(0);
    expect(enemy.person.attributePanel.DefencePower).toEqual(beforeBuffDefencePower);

    vi.clearAllTimers();
  });

  test('should success execute LowBuffDefencePowerMultiplierAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);
    const beforeBuffDefencePower = enemy.attributePanel.DefencePower;
    const action = new FisherActions.LowBuffDefencePowerMultiplierAction();
    expect(action.id).toEqual(ActionId.LowBuffDefencePowerMultiplierAction);

    action.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeTruthy();
    expect(enemy.person.attributePanel.BonusDefencePowerMultiplier).toEqual(
      1 + FisherActions.LowBuffDefencePowerMultiplierAction.DefencePowerMultiplier
    );

    action.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeFalsy();
    expect(enemy.person.attributePanel.BonusDefencePowerMultiplier).toEqual(1);
    expect(enemy.person.attributePanel.DefencePower).toEqual(beforeBuffDefencePower);

    vi.clearAllTimers();
  });

  test('should success execute LowBuffDefenceCorruptionAction', () => {
    vi.useFakeTimers();

    const item = new EnemyItem(testPerson);
    const enemy = new Enemy(item);

    const action = new FisherActions.LowBuffDefenceCorruptionAction();
    expect(action.id).toEqual(ActionId.LowBuffDefenceCorruptionAction);

    action.execute(enemy.person);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeTruthy();
    expect(enemy.person.attributePanel.BonusAttackPower).toEqual(
      FisherActions.LowBuffDefenceCorruptionAction.AttackPower
    );
    expect(enemy.person.attributePanel.DefenceCorruption).toEqual(
      FisherActions.LowBuffDefenceCorruptionAction.DefenceCorruption
    );

    action.abort();
    expect(enemy.actionManager.activeBuffActions.length).toEqual(0);
    expect(enemy.actionManager.activeBuffActions.includes(action)).toBeFalsy();
    expect(enemy.person.attributePanel.BonusAttackPower).toEqual(0);
    expect(enemy.person.attributePanel.DefenceCorruption).toEqual(0);

    vi.clearAllTimers();
  });
});
