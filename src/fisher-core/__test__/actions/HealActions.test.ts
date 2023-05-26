import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EnemyItem, IEnemyItem } from '../../fisher-item';
import { Enemy, Person } from '../../fisher-person';
import { HighHealAction, LowHealAction } from '../../fisher-actions/HealActions';

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

describe('HealActions', () => {
  test('should heal by LowHealAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const person1 = new Enemy(item1);
    person1.person.hurt(person1.attributePanel.MaxHp - 1);

    let value: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
    });

    person1.person.event.on(Person.PersonEventKeys.Heal, spyAction);
    const lowHealAction = new LowHealAction();
    lowHealAction.execute(person1.person);

    expect(spyAction).toBeCalled();
    expect(value).toEqual(person1.attributePanel.BaseMaxHp * LowHealAction.LowHealActionMultiplier);
    expect(person1.Hp).toEqual(1 + value);

    do {
      lowHealAction.execute(person1.person);
    } while (person1.Hp < person1.attributePanel.MaxHp);

    lowHealAction.execute(person1.person);
    expect(person1.Hp).toEqual(person1.attributePanel.MaxHp);
  });

  test('should heal by HighHealAction', () => {
    const item1 = new EnemyItem(testPerson1);
    const person1 = new Enemy(item1);
    person1.person.hurt(person1.attributePanel.MaxHp - 1);

    let value: number = 0;
    const spyAction = vi.fn().mockImplementation((result) => {
      value = result.value;
    });

    person1.person.event.on(Person.PersonEventKeys.Heal, spyAction);
    const highHealAction = new HighHealAction();
    highHealAction.execute(person1.person);

    expect(spyAction).toBeCalled();
    expect(value).toEqual(person1.attributePanel.BaseMaxHp * HighHealAction.HighHealActionMultiplier);
    expect(person1.Hp).toEqual(1 + value);

    do {
      highHealAction.execute(person1.person);
    } while (person1.Hp < person1.attributePanel.MaxHp);

    highHealAction.execute(person1.person);
    expect(person1.Hp).toEqual(person1.attributePanel.MaxHp);
  });
});
