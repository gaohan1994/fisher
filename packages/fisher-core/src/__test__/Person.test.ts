import { describe, expect, test, vi } from 'vitest';
import { EquipmentSlot } from '../fisher-item';
import { Person } from '../fisher-person';
import { PersonMode } from '../fisher-person/Constants';
import { FisherActions } from '../fisher-actions';

describe('Person', () => {
  test('should success constructor Person', () => {
    const person = new Person(PersonMode.CommonEnemy);
    expect(person.personEquipmentManager.equipmentMap.has(EquipmentSlot.Helmet)).toBeTruthy();

    const hurtSpyAction = vi.fn();
    const targetSpyAction = vi.fn();
    const healSpyAction = vi.fn();

    person.event.on(Person.PersonEventKeys.Hurt, hurtSpyAction);
    person.event.on(Person.PersonEventKeys.Heal, healSpyAction);
    person.event.on(Person.PersonEventKeys.TargetChange, targetSpyAction);

    const enemy = new Person(PersonMode.CommonEnemy);
    person.setTarget(enemy);
    enemy.setTarget(person);

    expect(targetSpyAction).toBeCalledTimes(1);

    const action = new FisherActions.NormalAttackAction();
    action.execute(enemy);
    action.execute(enemy);
    expect(hurtSpyAction).toBeCalledTimes(2);

    const healAction = new FisherActions.HighHealAction();
    healAction.execute(person);
    expect(healSpyAction).toBeCalledTimes(1);

    vi.clearAllMocks();
  });
});
