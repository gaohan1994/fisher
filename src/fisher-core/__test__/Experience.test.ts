import { beforeEach, describe, expect, test } from 'vitest';
import { Experience, ExperienceCalculator } from '../fisher-experience';

let experienceCalculator: ExperienceCalculator;
beforeEach(() => {
  experienceCalculator = ExperienceCalculator.create();
});

describe('Experience', () => {
  test('should success calculate level to experience', () => {
    expect(experienceCalculator.levelExperienceList.length).toBe(100);
    expect(experienceCalculator.getLevelExperience(1)).toBe(100);
  });

  test('should success calculate experience', () => {
    const experience = new Experience();
    experience.addExperience(239);
    expect(experience.level).toBe(2);
    experience.addExperience(1);
    expect(experience.level).toBe(3);
    experience.addExperience(1);
    expect(experience.level).toBe(3);
  });

  test('should success set level', () => {
    const experience = new Experience();
    expect(experience.level).toBe(1);

    experience.setLevel(3);
    expect(experience.level).toBe(3);

    experience.setLevel(33);
    expect(experience.level).toBe(33);
  });
});
