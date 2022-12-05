import { describe, expect, test } from 'vitest';
import {
  calculateLevelToExperience,
  calculateExperienceToLevel,
  calculateLevelExperienceInfo,
} from '../fisher-skill/Experience';

describe('Experience', () => {
  test('should out of max level when calculate level 100', () => {
    expect(() => calculateLevelToExperience(100)).toThrowError(
      'Fail to calculate level, out of max level 99:'
    );
  });

  test('should success calculate level to experience', () => {
    expect(calculateLevelToExperience(1)).toBe(140);
  });

  test('should success calculate experience', () => {
    expect(calculateExperienceToLevel(319)).toBe(2);
    expect(calculateExperienceToLevel(320)).toBe(3);
    expect(calculateExperienceToLevel(321)).toBe(3);
  });

  test('should success calculate next level experience', () => {
    const currentSkillExperience = 20;
    const { level, totalExperienceToLevelUp, remainingExperienceToLevelUp } =
      calculateLevelExperienceInfo(currentSkillExperience);
    expect(level).toBe(1);
    expect(totalExperienceToLevelUp).toBe(140);
    expect(remainingExperienceToLevelUp).toBe(140 - currentSkillExperience);
  });
});
