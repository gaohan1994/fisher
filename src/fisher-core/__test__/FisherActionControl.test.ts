import { describe, expect, test, vi } from 'vitest';
import { FisherActionControl } from '../fisher-action-control';

describe('FisherActionControl', () => {
  test('should initialize FisherActionControl', () => {
    const FAC = new FisherActionControl();
    expect(FAC.componentMap.size).toBe(0);
    expect(FAC.activeComponentId).toBe(undefined);
  });

  test('should success add action control components', () => {
    const FAC = new FisherActionControl();
    const testSkill = {
      id: 'Test:Skill',
      stop: vi.fn(),
    };
    FAC.addActionControlComponent(testSkill);
    expect(FAC.componentMap.size).toBe(1);
  });

  test('should stop other components which active id not equal to component id', () => {
    const FAC = new FisherActionControl();
    const id1 = 'Test:Skill1';
    const testSkill1 = {
      id: id1,
      stop: vi.fn(),
    };
    const id2 = 'Test:Skill2';
    const testSkill2 = {
      id: id2,
      stop: vi.fn(),
    };
    FAC.addActionControlComponents([testSkill1, testSkill2]);
    expect(FAC.componentMap.size).toBe(2);
    FAC.setActiveComponent(testSkill1 as any);
    expect(FAC.activeComponentId).toBe(id1);
    FAC.setActiveComponent(testSkill2 as any);
    expect(FAC.activeComponentId).toBe(id2);
    expect(testSkill1.stop).toBeCalled();
  });
});
