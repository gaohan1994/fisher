import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { store } from '../fisher-packages';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Reiki', () => {
  test('should success initialize Reiki', () => {
    const core = FisherCore.create();
    expect(core.reiki.id).toBe('Reiki');
    expect(core.reiki.name).toBe('打坐');
    expect(core.mining.experience).toBe(0);
  });

  test('should set active id when start Reiki', () => {
    const core = FisherCore.create();
    const activeRecipe = store.findRecipeById('Reiki:Recipe:BlackWoodCliff');
    core.reiki.start(activeRecipe);
    expect(core.activeComponentId).toBe(core.reiki.id);
  });
});
