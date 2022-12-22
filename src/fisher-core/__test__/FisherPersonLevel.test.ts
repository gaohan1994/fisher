import { describe, expect, test, vi } from 'vitest';
import {
  FisherPersonLevel,
  PersonLevel,
  BaseLevelUpBattleTimes,
  IPersonLevelUpMethods,
  EmptyLevelUpRequirements,
  EmptyRequirementsCompletion,
} from '../fisher-person';

describe('FisherPersonLevel', () => {
  test('should constructor FihserPersonLevel', () => {
    const personLevel = new FisherPersonLevel();
    expect(personLevel.state).toBeUndefined();
    expect(personLevel.level).toBeUndefined();
    expect(personLevel.label).toBeUndefined();
    expect(personLevel.coefficient).toBe(1);
    expect(personLevel.nextLevel).toBeUndefined();
    expect(personLevel.levelUpRequirements).toStrictEqual(
      EmptyLevelUpRequirements
    );
    expect(personLevel.levelUpRequirementsCompletion).toStrictEqual(
      EmptyRequirementsCompletion
    );
    expect(
      personLevel.levelUpCompletionStatus.meetLevelUpRequirements
    ).toBeFalsy();
    expect(personLevel.levelUpCompletionStatus.levelUpMethod).toBe(
      IPersonLevelUpMethods.Auto
    );
  });

  test('should initialize PersonLevl', () => {
    const personLevel = new FisherPersonLevel();
    personLevel.initialize({ level: PersonLevel.GasRefiningEarly });
    expect(personLevel.state).toBe('炼气期');
    expect(personLevel.level).toBe(PersonLevel.GasRefiningEarly);
    expect(personLevel.label).toBe('炼气前期');
    expect(personLevel.coefficient).toBe(1);
    expect(personLevel.nextLevel).toBe(PersonLevel.GasRefiningMiddle);
    expect(personLevel.levelUpRequirements.battleTimes).toBe(1000);
    expect(personLevel.levelUpRequirementsCompletion).toStrictEqual(
      EmptyRequirementsCompletion
    );
    expect(
      personLevel.levelUpCompletionStatus.meetLevelUpRequirements
    ).toBeFalsy();
    expect(personLevel.levelUpCompletionStatus.levelUpMethod).toBe(
      IPersonLevelUpMethods.Auto
    );
  });

  test('should auto level up', () => {
    const personLevel = new FisherPersonLevel();
    personLevel.initialize({ level: PersonLevel.GasRefiningEarly });
    const nextLevel = personLevel.nextLevel;
    personLevel.updateBattleTimes(
      personLevel.coefficient * BaseLevelUpBattleTimes
    );
    expect(personLevel.level).toBe(nextLevel);
    expect(personLevel.coefficient).toBe(2);
    expect(personLevel.label).toBe('炼气中期');
  });
  test('should reset completion when level up', () => {
    const personLevel = new FisherPersonLevel();
    personLevel.initialize({ level: PersonLevel.GasRefiningEarly });
    personLevel.updateBattleTimes(
      personLevel.coefficient * BaseLevelUpBattleTimes
    );
    expect(personLevel.levelUpRequirementsCompletion.battleTimes).toBe(0);
  });
});
