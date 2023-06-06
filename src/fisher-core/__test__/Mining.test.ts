import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { store } from '../fisher-packages';
import { Mining } from '../fisher-modules';

let core: FisherCore;
let mining: Mining;
beforeEach(() => {
  core = FisherCore.create();
  mining = core.mining;
});

describe('Mining', () => {
  test('should success initialize Mining', () => {
    const core = FisherCore.create();
    expect(core.mining.id).toBe('Mining');
    expect(core.mining.name).toBe('晶石');
    expect(core.mining.experience).toBe(0);
  });

  test('should set active id when start mining', () => {
    const core = FisherCore.create();
    const activeRecipe = store.findRecipeById('Mining:Recipe:LowSpiritMine');
    core.mining.start(activeRecipe);
    expect(core.activeComponentId).toBe(mining.id);
  });
});
