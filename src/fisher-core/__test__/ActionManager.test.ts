import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { IActionManager, Person, PersonMode } from '../fisher-person';
import { ActionId } from '../fisher-actions';
import { Timer } from '../fisher-timer';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('ActionManager', () => {
  test('should success initialize ActionManager', async () => {
    vi.useFakeTimers();

    const person = new Person(PersonMode.CommonEnemy, { actionIds: [ActionId.HighBatterAction] });
    const person2 = new Person(PersonMode.CommonEnemy);

    person.setTarget(person2);
    person2.setTarget(person);

    let result: IActionManager.ExecuteActionPayload | undefined = undefined;
    const spyAction = vi.fn().mockImplementation((_result) => {
      result = _result;
    });

    const { actionManager } = person;
    person.actionManager.event.on(IActionManager.ActionManagerEventKeys.ExecuteAction, spyAction);

    expect(actionManager.attackActions.length).toEqual(1);
    expect(actionManager.attackActions[0].id === ActionId.HighBatterAction);

    actionManager.startAttacking();
    vi.advanceTimersByTime(person.attributePanel.AttackSpeed);

    expect(spyAction).toBeCalled();
    expect(result!.action!.id).toEqual(ActionId.NormalAttackAction);
    expect(result!.lastAction).toBeUndefined();

    vi.advanceTimersByTime(person.attributePanel.AttackSpeed);

    expect(spyAction).toBeCalled();
    expect(
      [ActionId.CritAttackAction, ActionId.NormalAttackAction, ActionId.HighBatterAction].includes(
        result!.action!.id as ActionId
      )
    ).toBeTruthy();

    vi.advanceTimersByTime(Timer.Tick);
    expect(actionManager.attackActionTimer.progress).toBeGreaterThan(0);

    actionManager.stopAttacking();
    expect(actionManager.attackActionTimer.progress).toEqual(0);
    vi.advanceTimersByTime(Timer.Tick);
    expect(actionManager.attackActionTimer.progress).toEqual(0);

    vi.clearAllTimers();
  });

  test('should success register action ids', () => {
    const person = new Person(PersonMode.Master, {
      actionIds: [
        ActionId.HighBatterAction,
        ActionId.LowFixedDamageAction,
        ActionId.HighFixedDamageAction,
        ActionId.LowBatterAction,
      ],
    });
    const { actionManager } = person;

    expect(actionManager.attackActions.length).toEqual(4);
    expect(~actionManager.attackActions.findIndex((action) => action.id === ActionId.HighBatterAction)).toBeTruthy();
    expect(
      ~actionManager.attackActions.findIndex((action) => action.id === ActionId.LowFixedDamageAction)
    ).toBeTruthy();
    expect(
      ~actionManager.attackActions.findIndex((action) => action.id === ActionId.HighFixedDamageAction)
    ).toBeTruthy();
    expect(~actionManager.attackActions.findIndex((action) => action.id === ActionId.LowBatterAction)).toBeTruthy();

    actionManager.registerActions([ActionId.PosionDotAction]);
    expect(actionManager.attackActions.length).toEqual(0);
    expect(actionManager.dotActions.length).toEqual(1);
    expect(~actionManager.dotActions.findIndex((action) => action.id === ActionId.PosionDotAction)).toBeTruthy();
  });
});
