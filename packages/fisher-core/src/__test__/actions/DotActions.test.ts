import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy } from '../../fisher-person';
import { FisherActions } from '../../fisher-actions';

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

describe('DotActions', () => {
  test('should success run PosionDotAction', () => {
    vi.useFakeTimers();

    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    const action = new FisherActions.PosionDotAction();

    action.execute(person1.person);

    // dot action effective first time
    expect(person2.actionManager.activeDotActions.includes(action)).toBeTruthy();
    expect(person2.actionManager.activeDotActions[0]?.effectiveTimes).toBe(1);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp - action.damage());

    // dot action effective the second time
    vi.advanceTimersByTime(action.interval);
    expect(person2.actionManager.activeDotActions[0]?.effectiveTimes).toBe(2);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp - 2 * action.damage());

    // dot action finished
    vi.advanceTimersByTime(3 * action.interval);
    expect(person2.actionManager.activeDotActions.includes(action)).toBeFalsy();
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp - action.totalEffectiveTimes * action.damage());

    vi.clearAllTimers();
  });
});
