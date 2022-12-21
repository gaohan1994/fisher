import { describe, expect, test } from 'vitest';
import {
  FisherCore,
  FisherBackpack,
  FisherGold,
  Reiki,
  FisherPerson,
  Mining,
} from '@FisherCore';

describe('FisherCore', () => {
  test('should initialize FisherCore', () => {
    const fisherCore = new FisherCore();
    expect(fisherCore.fisherBackpack instanceof FisherBackpack).toBeTruthy();
    expect(fisherCore.fisherGold instanceof FisherGold).toBeTruthy();
    expect(fisherCore.mining instanceof Mining).toBeTruthy();
    expect(fisherCore.reiki instanceof Reiki).toBeTruthy();
    expect(fisherCore.master instanceof FisherPerson).toBeTruthy();

    expect(fisherCore.activeComponent).toBeUndefined();
    expect(fisherCore.activeComponentId).toBeUndefined();
  });

  test('should success control component active', () => {
    const fisherCore = new FisherCore();
    fisherCore.setActiveComponent(fisherCore.mining);
    expect(fisherCore.activeComponent instanceof Mining).toBeTruthy();
    expect(fisherCore.activeComponentId).toBe('Collection:Mining');
    fisherCore.setActiveComponent(fisherCore.reiki);
    expect(fisherCore.activeComponent instanceof Reiki).toBeTruthy();
    expect(fisherCore.activeComponentId).toBe('Collection:Reiki');
  });
});
