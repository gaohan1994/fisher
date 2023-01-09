import { beforeEach, describe, expect, test } from 'vitest';
import { Store } from '../fisher-packages';
import miningDataJson from '../fisher-packages/data/MiningData.json';
import { FisherCore } from '../fisher-core';

let store: Store;
let core: FisherCore;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
});

describe('FisherPackages', () => {
  test('should launch packages data', () => {
    expect(store.items.length).toBeGreaterThan(0);
    expect(store.Mining.items.length).toBeGreaterThan(0);
    expect(store.Mining.recipes.length).toBeGreaterThan(0);
    expect(store.Reiki.items.length).toBeGreaterThan(0);
    expect(store.Reiki.recipes.length).toBeGreaterThan(0);
    expect(store.BattleAreas.length).toBeGreaterThan(0);
    expect(store.BattleEnemies.length).toBeGreaterThan(0);
  });
});

describe('FisherPackagesInterface', () => {
  test('should success find packages data', () => {
    expect(store.findItemById(miningDataJson.data.items[0].id).id).toBe('LowSpiritMine');
    expect(store.findItemById(miningDataJson.data.recipes[0].id).id).toBe('Mining:Recipe:LowSpiritMine');
  });

  test('find data should throw error when pass wrong id', () => {
    expect(() => store.findItemById('WrongTestId')).toThrowError('Could not find Item id: WrongTestId');
    expect(() => store.findRecipeById('WrongTestId')).toThrowError('Could not find Item id: WrongTestId');
  });
});
