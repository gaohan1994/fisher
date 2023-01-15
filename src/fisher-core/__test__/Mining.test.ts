import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { mining } from '../fisher-modules';
import { store } from '../fisher-packages';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Mining', () => {
  test('should success initialize Mining', () => {
    const core = FisherCore.create();
    expect(core.mining.id).toBe('Mining');
    expect(core.mining.name).toBe('采矿');
    expect(core.mining.experience).toBe(0);
  });

  test('should set active id when start mining', () => {
    const core = FisherCore.create();
    const activeRecipe = store.findRecipeById('Mining:Recipe:LowSpiritMine');
    core.mining.start(activeRecipe);
    expect(core.activeComponentId).toBe(mining.id);
  });
});
