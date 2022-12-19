import { describe, expect, test, vi } from 'vitest';
import {
  FisherPersonLevel,
  PersonLevel,
  BaseLevelUpBattleTimes,
  IPersonLevelUpMethods,
} from '../fisher-person';

describe('FisherPersonLevel', () => {
  test('should initialize FihserPersonLevel', () => {
    const personLevel = new FisherPersonLevel({
      level: PersonLevel.GasRefiningEarly,
    });
    expect(personLevel.state).toBe('炼气期');
    expect(personLevel.level).toBe(PersonLevel.GasRefiningEarly);
    expect(personLevel.label).toBe('炼气前期');
    expect(personLevel.coefficient).toBe(1);
    expect(personLevel.nextLevel).toBe(PersonLevel.GasRefiningMiddle);
    expect(personLevel.levelUpRequirements.battleTimes).toBe(
      personLevel.coefficient * BaseLevelUpBattleTimes
    );
    expect(personLevel.levelUpRequirements.tasks.length).toBe(0);
    expect(personLevel.levelUpRequirementsCompletion.battleTimes).toBe(0);
    expect(
      personLevel.levelUpCompletionStatus.meetLevelUpRequirements
    ).toBeFalsy();
    expect(personLevel.levelUpCompletionStatus.levelUpMethod).toBe(
      IPersonLevelUpMethods.Auto
    );
  });
});

describe('FisherPersonLevel level up', () => {
  test('should auto level up when progress meet', () => {
    const personLevel = new FisherPersonLevel({
      level: PersonLevel.GasRefiningEarly,
    });
    const nextLevel = personLevel.nextLevel;
    personLevel.updateBattleTimes(
      personLevel.coefficient * BaseLevelUpBattleTimes
    );
    expect(personLevel.level).toBe(nextLevel);
    expect(personLevel.coefficient).toBe(2);
    expect(personLevel.label).toBe('炼气中期');
  });
  test('should reset completion when level up', () => {
    const personLevel = new FisherPersonLevel({
      level: PersonLevel.GasRefiningEarly,
    });
    personLevel.updateBattleTimes(
      personLevel.coefficient * BaseLevelUpBattleTimes
    );
    expect(personLevel.levelUpRequirementsCompletion.battleTimes).toBe(0);
  });
});
