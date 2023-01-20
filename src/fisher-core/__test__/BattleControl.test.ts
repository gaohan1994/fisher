/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { BattleControl } from '../fisher-battle';
import { EventKeys, events } from '../fisher-events';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { store } from '../fisher-packages';
import { Enemy } from '../fisher-person';

const testEnemyItem = store.findEnemyById('LowSpiritMonster');

describe('BattleControl', () => {
  test('should success set active enemy item', () => {
    const battleControl = new BattleControl();
    expect(battleControl.activeEnemyItem).toBeUndefined();
    expect(battleControl.enemy).toBeUndefined();

    battleControl.setAcitveEnemyItem(testEnemyItem);
    expect(battleControl.activeEnemyItem).toStrictEqual(testEnemyItem);
    expect(battleControl.enemy instanceof Enemy).toBeTruthy();

    test('should success set target when create enemy', () => {
      expect(battleControl.master.person.target).toStrictEqual(battleControl.enemy?.person);
      expect(battleControl.enemy?.person.target).toStrictEqual(battleControl.master.person);
    });

    test('should clear active enemy item and enemy when set active enemy item to undefined', () => {
      battleControl.setAcitveEnemyItem(undefined);
      expect(battleControl.activeEnemyItem).toBeUndefined;
      expect(battleControl.enemy).toBeUndefined();

      test('should set target undefined when clear enemy', () => {
        expect(battleControl.master.person.target).toBeUndefined();
      });
    });
  });

  test('should throw error when start battle without enemy', () => {
    const battleControl = new BattleControl();
    expect(() => battleControl.startBattle()).toThrowError(`Try to start battle with undefined enemy`);
  });

  test('should success start battle', () => {
    vi.useFakeTimers();

    const battleControl = new BattleControl();
    battleControl.setAcitveEnemyItem(testEnemyItem);
    expect(battleControl.enemy?.Hp).toBe(battleControl.enemy!.attributePanel.MaxHp);

    battleControl.startBattle();
    expect(battleControl.master.person.isAttacking).toBeTruthy();
    expect(battleControl.enemy!.person.isAttacking).toBeTruthy();

    vi.advanceTimersByTime(battleControl.master.attributePanel.AttackSpeed);
    expect(battleControl.enemy?.Hp).toBeLessThan(battleControl.enemy!.attributePanel.MaxHp);

    vi.clearAllTimers();
  });

  test('should success stop battle', () => {
    vi.useFakeTimers();

    const battleControl = new BattleControl();
    battleControl.setAcitveEnemyItem(testEnemyItem);

    battleControl.startBattle();
    expect(battleControl.master.person.isAttacking).toBeTruthy();
    expect(battleControl.enemy!.person.isAttacking).toBeTruthy();

    battleControl.stopBattle();
    expect(battleControl.master.person.isAttacking).toBeFalsy();
    expect(battleControl.enemy!.person.isAttacking).toBeFalsy();

    test('should not clear target when stop battle', () => {
      expect(battleControl.master.person.target).toStrictEqual(battleControl.enemy?.person);
      expect(battleControl.enemy?.person.target).toStrictEqual(battleControl.master.person);
    });

    vi.clearAllTimers();
  });

  test('should continue battle active enemy after enemy death', () => {
    const battleControl = new BattleControl();
    battleControl.setAcitveEnemyItem(testEnemyItem);
    const debugWeapon = new EquipmentItem({
      id: 'WoodSword',
      name: '新手木剑',
      desc: '用寻常木头做的剑',
      media: 'woodsword',
      price: 5,
      slot: 'Weapon',
      attributes: [{ key: 'AttackPower', value: 4000 }],
    });
    vi.useFakeTimers();

    const prevEnemyId = battleControl.enemy!.id;
    const prevEnemyKey = battleControl.enemy!.key;
    const spyAction = vi.fn();
    events.on(EventKeys.Core.EnemyDeath, spyAction);

    battleControl.master.personEquipmentManager.useEquipment(debugWeapon);
    battleControl.startBattle();

    vi.advanceTimersByTime(battleControl.master.attributePanel.AttackSpeed);

    expect(spyAction).toBeCalled();
    expect(prevEnemyId === battleControl.enemy!.id).toBeTruthy();
    expect(prevEnemyKey === battleControl.enemy!.key).toBeFalsy();

    vi.clearAllTimers();
  });

  test('should stop battle after master death', () => {
    const battleControl = new BattleControl();
    battleControl.setAcitveEnemyItem(testEnemyItem);

    const prevEnemy = battleControl.enemy;

    const debugWeapon = new EquipmentItem({
      id: 'WoodSword',
      name: '新手木剑',
      desc: '用寻常木头做的剑',
      media: 'woodsword',
      price: 5,
      slot: 'Weapon',
      attributes: [{ key: 'AttackPower', value: 4000 }],
    });
    vi.useFakeTimers();

    const spyAction = vi.fn();
    events.on(EventKeys.Core.MasterDeath, spyAction);

    battleControl.master.personEquipmentManager.removeEquipment(EquipmentSlot.Weapon);
    battleControl.enemy?.personEquipmentManager.useEquipment(debugWeapon);
    battleControl.startBattle();

    vi.advanceTimersByTime(battleControl.enemy!.attributePanel.AttackSpeed);

    expect(spyAction).toBeCalled();
    expect(battleControl.master.person.isAttacking).toBeFalsy();
    // expect(battleControl.enemy?.person.isAttacking).toBeFalsy();
    expect(battleControl.enemy).toStrictEqual(prevEnemy);
    expect(battleControl.master.Hp).toEqual(battleControl.master.attributePanel.MaxHp);

    vi.clearAllTimers();
  });
});
