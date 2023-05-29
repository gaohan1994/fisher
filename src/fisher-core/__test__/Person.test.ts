import { beforeEach, describe, expect, test, vi } from 'vitest';
import { EquipmentSlot } from '../fisher-item';
import { Person, PersonEquipmentManager, ActionManager } from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';
import { FisherCore } from '../fisher-core';
import { PersonMode } from '../fisher-person/Constants';
import { FisherActions } from '../fisher-actions';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Person', () => {
  test('should success constructor Person', () => {
    const person = new Person(PersonMode.CommonEnemy);
    expect(person.actionManager instanceof ActionManager).toBeTruthy();
    expect(person.personEquipmentManager instanceof PersonEquipmentManager).toBeTruthy();
    expect(person.personEquipmentManager.equipmentMap.has(EquipmentSlot.Helmet)).toBeTruthy();
    expect(person.attributePanel instanceof AttributePanel).toBeTruthy();

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

  test('should success run person methods', () => {
    const person = new Person(PersonMode.Master);
    const enemy = new Person(PersonMode.CommonEnemy);

    person.setTarget(enemy);
    enemy.setTarget(person);

    person.startBattle();
    expect(person.isAttacking).toBeTruthy();
  });
});
