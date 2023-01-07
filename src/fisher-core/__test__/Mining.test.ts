import { describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { mining } from '../fisher-modules';
import { findRecipeById } from '../fisher-packages';

describe('Mining', () => {
  test('should success initialize Mining', () => {
    const core = FisherCore.create();
    expect(core.mining.id).toBe('Mining');
    expect(core.mining.name).toBe('采矿');
    expect(core.mining.skill.id).toBe('Mining:Skill');
    expect(core.mining.skill.experience).toBe(0);
  });

  test('should set active id when start mining', () => {
    const core = FisherCore.create();
    const activeRecipe = findRecipeById('Mining:Recipe:LowSpiritMine');
    core.mining.start(activeRecipe);
    expect(core.activeComponentId).toBe(mining.id);
  });
});
