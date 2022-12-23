import { describe, expect, test, vi } from 'vitest';
import { FisherPerson } from '../fisher-person';
import {
  ActionManager,
  ActionMode,
  NormalAttackAction,
} from '../fisher-person/person-actions';
import { FisherProgressTimer } from '../fisher-timer';

describe('FisherPersonAction', () => {
  test('should initialize attack action', () => {
    const person1 = new FisherPerson();
    const person2 = new FisherPerson();
    person1.setTarget(person2);
    person2.setTarget(person1);
    const normalAttackAction = new NormalAttackAction(person1);
    expect(normalAttackAction.id).toBe('NormalAttackAction');
    expect(normalAttackAction.name).toBe('普通攻击');
    expect(normalAttackAction.mode).toBe(ActionMode.Attack);
    expect(
      normalAttackAction.timer instanceof FisherProgressTimer
    ).toBeTruthy();
  });

  test('should initialize action manager', () => {
    vi.useFakeTimers();
    const person1 = new FisherPerson();
    person1.initialize({
      mode: FisherPerson.Mode.Master,
      name: '1',
      level: FisherPerson.Level.GasRefiningEarly,
    });
    const person2 = new FisherPerson();
    person2.initialize({
      mode: FisherPerson.Mode.Enemy,
      name: '1',
      level: FisherPerson.Level.GasRefiningEarly,
    });
    person1.setTarget(person2);
    person2.setTarget(person1);

    expect(person1.actionManager instanceof ActionManager).toBeTruthy();
    expect(person1.actionManager.actionMap.size).toBeGreaterThan(0);
    person1.startBattle();
    expect(person1.actionManager.actionDisposeMap.size).toBeGreaterThan(0);
    person1.stopBattle();
    vi.clearAllTimers();
  });
});
