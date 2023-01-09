import { describe, expect, test } from 'vitest';
import { Item, Recipe } from '../fisher-item';
import { findItemById, findRecipeById, store } from '../fisher-packages';
import miningDataJson from '../fisher-packages/data/MiningData.json';

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
    expect(findItemById(miningDataJson.data.items[0].id) instanceof Item).toBeTruthy();
    expect(findRecipeById(miningDataJson.data.recipes[0].id) instanceof Recipe).toBeTruthy();
  });

  test('find data should throw error when pass wrong id', () => {
    expect(() => findItemById('WrongTestId')).toThrowError('Could not find Item id: WrongTestId');
    expect(() => findRecipeById('WrongTestId')).toThrowError('Could not find Item id: WrongTestId');
  });
});
