import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { findRecipeById } from '../fisher-packages';

const fisher = new FisherCore();

vi.stubGlobal('fisher', fisher);

describe('Reiki', () => {
  test('should success initialize Reiki', () => {
    const fisherCore = new FisherCore();
    expect(fisherCore.mining.id).toBe('Reiki');
    expect(fisherCore.mining.name).toBe('灵气');
    expect(fisherCore.mining.skill.id).toBe('Reiki:Skill');
    expect(fisherCore.mining.skill.experience).toBe(0);
  });

  test('should set active id when start Reiki', () => {
    const activeRecipe = findRecipeById('Reiki:Recipe:BlackWoodCliff:Part1');
    fisher.reiki.start(activeRecipe);
    expect(fisher.activeActionId).toBe(fisher.reiki.id);
  });
});
