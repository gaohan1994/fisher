import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { ComponentId, ComponentManager } from '../fisher-core/ComponentManager';
import { EventKeys, events } from '../fisher-events';
import { Mining } from '../fisher-modules';

let core: FisherCore;
let componentManager: ComponentManager;
let mining: Mining;
beforeEach(async () => {
  core = FisherCore.create();
  componentManager = core.componentManager;
  componentManager.clearActiveComponent();
  mining = core.mining;
});

describe('ComponentManager', () => {
  test('should initialize ComponentManager', () => {
    expect(componentManager.bank.id).toEqual(ComponentId.Bank);
    expect(componentManager.backpack.id).toEqual(ComponentId.Backpack);
    expect(componentManager.mining.id).toEqual(ComponentId.Mining);
    expect(componentManager.reiki.id).toEqual(ComponentId.Reiki);
    expect(componentManager.forge.id).toEqual(ComponentId.Forge);
    expect(componentManager.battle.id).toEqual(ComponentId.Battle);
    expect(componentManager.activeComponent).toBeUndefined();
  });
});

describe('ComponentManager Events', () => {
  test('should success listen SetActiveComponent', () => {
    expect(componentManager.activeComponent).toBeUndefined();
    componentManager.setActiveComponent(componentManager.mining);
    expect(componentManager.activeComponentId).toBe('Mining');
    events.emit(EventKeys.Core.SetActiveComponent, componentManager.reiki);
    expect(componentManager.activeComponentId).toBe('Reiki');
  });

  test('should success listen RewardExperience', () => {
    expect(componentManager.mining.experience).toBe(0);
    events.emit(EventKeys.Reward.RewardExperience, 'Mining', 10);
    expect(core.mining.experience).toBe(10);
    events.emit(EventKeys.Reward.RewardExperience, 'Mining', 10);
    expect(componentManager.mining.experience).toBe(20);
  });
});
