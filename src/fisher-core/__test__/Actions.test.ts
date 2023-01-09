import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { EnemyItem, IEnemyItem, PersonLevel } from '../fisher-item';
import { Enemy } from '../fisher-person';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testPerson1: IEnemyItem = {
  id: 'LowSpritMonster1',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: PersonLevel.GasRefiningEarly,
};

const testPerson2: IEnemyItem = {
  id: 'LowSpritMonster2',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: PersonLevel.GasRefiningEarly,
};

describe('Actions', () => {
  test('should hurt after execute normal attack action', () => {
    vi.useFakeTimers();

    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1.id);
    person1.initialize(item1);

    const person2 = new Enemy(item2.id);
    person2.initialize(item2);

    person1.setTarget(person2);
    person2.setTarget(person1);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    person1.startBattle();
    vi.advanceTimersByTime(person1.attributePanel.AttackSpeed);

    expect(person2.Hp).toBeLessThan(person2.attributePanel.MaxHp - 0.9 * person1.attributePanel.AttackDamage);
    expect(person2.Hp).toBeGreaterThan(person2.attributePanel.MaxHp - 1.1 * person1.attributePanel.AttackDamage);

    vi.clearAllTimers();
  });

  test('should hurt after execute crit attack action', () => {
    vi.useFakeTimers();

    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1.id);
    person1.initialize(item1);

    const person2 = new Enemy(item2.id);
    person2.initialize(item2);

    person1.setTarget(person2);
    person2.setTarget(person1);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    person1.actionManager.critAttackAction.execute(person1);
    expect(person2.Hp).toBeLessThan(person2.attributePanel.MaxHp - 0.9 * 2 * person1.attributePanel.AttackDamage);
    expect(person2.Hp).toBeGreaterThan(person2.attributePanel.MaxHp - 1.1 * 2 * person1.attributePanel.AttackDamage);

    vi.clearAllTimers();
  });

  test('should hurt by dot action', () => {
    vi.useFakeTimers();

    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1.id);
    person1.initialize(item1);

    const person2 = new Enemy(item2.id);
    person2.initialize(item2);

    person1.setTarget(person2);
    person2.setTarget(person1);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    const personStateDotAction = person1.actionManager.dotActionMap.get('PersonStateDotAction');
    if (personStateDotAction === undefined) return;

    personStateDotAction.initialize(person1);
    person2.actionManager.deployDotAction(personStateDotAction);

    // dot action effective first time
    expect(person2.actionManager.activeDotActionMap.has('PersonStateDotAction')).toBeTruthy();
    expect(person2.actionManager.activeDotActionMap.get('PersonStateDotAction')?.effectiveTimes).toBe(1);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp - person1.attributePanel.BaseAttackPower);

    // dot action effective the second time
    vi.advanceTimersByTime(personStateDotAction.interval);
    expect(person2.actionManager.activeDotActionMap.get('PersonStateDotAction')?.effectiveTimes).toBe(2);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp - 2 * person1.attributePanel.BaseAttackPower);

    // dot action finished
    vi.advanceTimersByTime(3 * personStateDotAction.interval);
    expect(person2.actionManager.activeDotActionMap.has('PersonStateDotAction')).toBeFalsy();
    expect(person2.Hp).toEqual(
      person2.attributePanel.MaxHp - personStateDotAction.totalEffectiveTimes * person1.attributePanel.BaseAttackPower
    );

    vi.clearAllTimers();
  });
});
