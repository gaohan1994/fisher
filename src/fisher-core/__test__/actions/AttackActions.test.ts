import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy, Person } from '../../fisher-person';
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

describe('AttackActions', () => {
  test('should hurt after execute normal attack action', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);
    expect(person2.Hp).toEqual(person2.attributePanel.MaxHp);

    let value: number = 0;
    let currentHp: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
      currentHp = result.currentHp;
    });

    const normalAttackAction = new FisherActions.NormalAttackAction();
    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);
    normalAttackAction.execute(person1.person);

    expect(spyAction).toBeCalled();
    expect(value).toBeLessThan(1.1 * person1.attributePanel.AttackDamage);
    expect(value).toBeGreaterThan(0.9 * person1.attributePanel.AttackDamage);
    expect(currentHp).toBeLessThan(person2.attributePanel.MaxHp);
  });

  test('should hurt after execute crit attack action', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);

    let value: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
    });

    const critAttackAction = new FisherActions.CritAttackAction();
    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);
    critAttackAction.execute(person1.person);

    expect(spyAction).toBeCalled();
    expect(value).toBeLessThan(1.1 * 2 * person1.attributePanel.AttackDamage);
    expect(value).toBeGreaterThan(0.9 * 2 * person1.attributePanel.AttackDamage);
  });

  test('should success run LowFixedDamageAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);

    let value: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
    });

    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);
    const lowFixedDamageAction = new FisherActions.LowFixedDamageAction();
    lowFixedDamageAction.execute(person1.person);

    const damage =
      person1.person.experience.level * FisherActions.LowFixedDamageAction.LowFixedDamageActionMultiplier +
      person1.attributePanel.AttackDamage;

    expect(spyAction).toBeCalled();
    expect(value).toEqual(damage);
  });

  test('should success run HighFixedDamageAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);

    let value: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
    });

    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);

    const highFixedDamageAction = new FisherActions.HighFixedDamageAction();
    highFixedDamageAction.execute(person1.person);

    const damage =
      person1.person.experience.level * FisherActions.HighFixedDamageAction.HighFixedDamageActionMultiplier +
      person1.attributePanel.AttackDamage;

    expect(spyAction).toBeCalled();
    expect(value).toEqual(damage);
  });

  test('should success run LowBatterAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);

    let values: number[] = [];
    const spyAction = vi.fn().mockImplementation((result) => {
      values.push(result.value);
    });

    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);
    const lowBatterAction = new FisherActions.LowBatterAction();
    lowBatterAction.execute(person1.person);

    expect(spyAction).toBeCalledTimes(FisherActions.LowBatterAction.LowBatterActionAttackFrequency);
    expect(values.length).toEqual(FisherActions.LowBatterAction.LowBatterActionAttackFrequency);

    const damage = person1.attributePanel.AttackDamage * FisherActions.LowBatterAction.LowBatterActionDamangeMultiplier;
    values.forEach((value) => {
      expect(value).toBeLessThan(1.1 * damage);
      expect(value).toBeGreaterThan(0.9 * damage);
    });
  });

  test('should success run HighBatterAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const item2 = new EnemyItem(testPerson2);

    const person1 = new Enemy(item1);
    const person2 = new Enemy(item2);

    person1.setTarget(person2.person);
    person2.setTarget(person1.person);

    let values: number[] = [];
    const spyAction = vi.fn().mockImplementation((result) => {
      values.push(result.value);
    });

    person2.person.event.on(Person.PersonEventKeys.Hurt, spyAction);
    const highBatterAction = new FisherActions.HighBatterAction();
    highBatterAction.execute(person1.person);

    expect(spyAction).toBeCalledTimes(FisherActions.HighBatterAction.HighBatterActionAttackFrequency);
    expect(values.length).toEqual(FisherActions.HighBatterAction.HighBatterActionAttackFrequency);

    const damage =
      person1.attributePanel.AttackDamage * FisherActions.HighBatterAction.HighBatterActionDamangeMultiplier;
    values.forEach((value) => {
      expect(value).toBeLessThan(1.1 * damage);
      expect(value).toBeGreaterThan(0.9 * damage);
    });

    const effectHp =
      person1.attributePanel.BaseMaxHp * FisherActions.HighBatterAction.HighBatterActionEffectHpMultiplier;
    expect(person1.Hp).toEqual(person1.attributePanel.MaxHp - effectHp);
  });
});
