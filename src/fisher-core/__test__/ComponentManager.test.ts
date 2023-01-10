import { beforeEach, describe, expect, test } from 'vitest';
import { Battle } from '../fisher-battle';
import { ComponentManager } from '../fisher-core/ComponentManager';
import { Forge, Mining, Reiki } from '../fisher-modules';

let componentManager: ComponentManager;
beforeEach(() => {
  componentManager = new ComponentManager();
});

describe('ComponentManager', () => {
  test('should initialize ComponentManager', () => {
    expect(componentManager.componentIds).toStrictEqual(['Mining', 'Reiki', 'Forge', 'Battle']);
    expect(componentManager.mining instanceof Mining).toBeTruthy();
    expect(componentManager.reiki instanceof Reiki).toBeTruthy();
    expect(componentManager.forge instanceof Forge).toBeTruthy();
    expect(componentManager.battle instanceof Battle).toBeTruthy();
    expect(componentManager.activeComponent).toBeUndefined();
  });
});

describe('ComponentManager interface', () => {
  test('test findComponentById', () => {
    test('should return undefined', () => {
      expect(componentManager.findComponentById('WrongComponentId')).toBeUndefined();
    });

    test('should return component', () => {
      expect(componentManager.findComponentById('Battle')).toStrictEqual(componentManager.battle);
    });
  });

  test('test findSkillComponentById', () => {
    test('should return undefined', () => {
      expect(componentManager.findSkillComponentById('WrongSkillComponentId')).toBeUndefined();
    });

    test('should return SkillComponent', () => {
      expect(componentManager.findSkillComponentById('Mining').component).toStrictEqual(componentManager.mining);
      expect(componentManager.findSkillComponentById('Mining').skill).toStrictEqual(componentManager.mining.skill);
    });
  });

  test('should success control component active', () => {
    componentManager.setActiveComponent(componentManager.mining);
    expect(componentManager.activeComponent instanceof Mining).toBeTruthy();
    expect(componentManager.activeComponentId).toBe('Mining');

    componentManager.setActiveComponent(componentManager.reiki);
    expect(componentManager.activeComponent instanceof Reiki).toBeTruthy();
    expect(componentManager.activeComponentId).toBe('Reiki');
  });
});
