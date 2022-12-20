import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { findRecipeById } from '../fisher-packages';

const fisher = new FisherCore();

vi.stubGlobal('fisher', fisher);

describe('Mining', () => {
  test('should success initialize Mining', () => {
    const fisherCore = new FisherCore();
    expect(fisherCore.mining.id).toBe('Collection:Mining');
    expect(fisherCore.mining.name).toBe('采矿');
    expect(fisherCore.mining.skill.id).toBe('Mining');
    expect(fisherCore.mining.skill.experience).toBe(0);
  });

  test('should set active id when start mining', () => {
    const activeRecipe = findRecipeById('Mining:Recipe:LowSpiritMine');
    fisher.mining.start(activeRecipe);
    expect(fisher.activeComponentId).toBe(fisher.mining.id);
  });
});
