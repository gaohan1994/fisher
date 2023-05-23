import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy } from '../../fisher-person';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testPerson1: IEnemyItem = {
  id: 'LowSpiritMonster1',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: 1,
};

const testPerson2: IEnemyItem = {
  id: 'LowSpiritMonster2',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: 1,
};

describe('AttackActions', () => {
  test('should hurt after execute normal attack action', () => {
    vi.useFakeTimers();

    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);
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

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    person1.actionManager.critAttackAction.execute(person1.person);
    expect(person2.Hp).toBeLessThan(person2.attributePanel.MaxHp - 0.9 * 2 * person1.attributePanel.AttackDamage);
    expect(person2.Hp).toBeGreaterThan(person2.attributePanel.MaxHp - 1.1 * 2 * person1.attributePanel.AttackDamage);

    vi.clearAllTimers();
  });
});