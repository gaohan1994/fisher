import { describe, expect, test } from 'vitest';
import { FisherSkill } from '../fisher-skill';

const payload = {
  id: 'Mining',
  name: '采矿',
};

describe('FisherSkill', () => {
  test('should success initialize FisherSkill ', () => {
    const skill = new FisherSkill(payload);
    expect(skill.level).toBe(1);
    expect(skill.id).toMatch('Mining');
    expect(skill.name).toMatch('采矿');
  });

  test('should success calculate level experience info', () => {
    const skill = new FisherSkill(payload);
    expect(skill.levelExpInfo.level).toBe(1);
    expect(skill.levelExpInfo.totalExperienceToLevelUp).toBe(140);
    expect(skill.levelExpInfo.remainingExperienceToLevelUp).toBe(140);
  });

  test('should success level up when add enough experience', () => {
    const skill = new FisherSkill(payload);
    expect(skill.level).toBe(1);
    skill.addExperience(139);
    expect(skill.level).toBe(1);
    skill.addExperience(1);
    expect(skill.level).toBe(2);
  });

  test('should success calculate level experience info when level up', () => {
    const skill = new FisherSkill(payload);
    expect(skill.level).toBe(1);
    expect(skill.levelExpInfo.remainingExperienceToLevelUp).toBe(140);
    expect(skill.levelExpInfo.totalExperienceToLevelUp).toBe(140);

    skill.addExperience(140);
    expect(skill.level).toBe(2);
    expect(skill.levelExpInfo.totalExperienceToLevelUp).toBe(320);
    expect(skill.levelExpInfo.remainingExperienceToLevelUp).toBe(320 - 140);
  });
});
