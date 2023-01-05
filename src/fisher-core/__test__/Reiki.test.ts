import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { findRecipeById } from '../fisher-packages';

describe('Reiki', () => {
  test('should success initialize Reiki', () => {
    const core = FisherCore.create();
    expect(core.reiki.id).toBe('Collection:Reiki');
    expect(core.reiki.name).toBe('灵气');
    expect(core.reiki.skill.id).toBe('Reiki');
    expect(core.reiki.skill.experience).toBe(0);
  });

  test('should set active id when start Reiki', () => {
    const core = FisherCore.create();
    const activeRecipe = findRecipeById('Reiki:Recipe:BlackWoodCliff:Part1');
    core.reiki.start(activeRecipe);
    expect(core.activeComponentId).toBe(core.reiki.id);
  });
});
