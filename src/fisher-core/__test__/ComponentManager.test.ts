import { beforeEach, describe, expect, test } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { Bank } from '../fisher-bank';
import { Battle } from '../fisher-battle';
import { ComponentManager } from '../fisher-core/ComponentManager';
import { EventKeys, events } from '../fisher-events';
import { Forge, Mining, Reiki } from '../fisher-modules';

let componentManager: ComponentManager;
beforeEach(() => {
  componentManager = new ComponentManager();
  componentManager.setActiveComponent(undefined);
});

describe('ComponentManager', () => {
  test('should initialize ComponentManager', () => {
    expect(componentManager.bank instanceof Bank).toBeTruthy();
    expect(componentManager.backpack instanceof Backpack).toBeTruthy();
    expect(componentManager.mining instanceof Mining).toBeTruthy();
    expect(componentManager.reiki instanceof Reiki).toBeTruthy();
    expect(componentManager.forge instanceof Forge).toBeTruthy();
    expect(componentManager.battle instanceof Battle).toBeTruthy();
    expect(componentManager.activeComponent).toBeUndefined();
  });
});

describe('ComponentManager Events', () => {
  test('should success listen SetActiveComponent', () => {
    expect(componentManager.activeComponent).toBeUndefined();
    componentManager.setActiveComponent(componentManager.mining);
    expect(componentManager.activeComponent instanceof Mining).toBeTruthy();
    expect(componentManager.activeComponentId).toBe('Mining');

    events.emit(EventKeys.Core.SetActiveComponent, componentManager.reiki);
    expect(componentManager.activeComponent instanceof Reiki).toBeTruthy();
    expect(componentManager.activeComponentId).toBe('Reiki');
  });
});
