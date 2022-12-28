import { describe, expect, test } from 'vitest';
import { FisherItem, FisherRecipeItem } from '../fisher-item';
import {
  findFisherItemById,
  findRecipeById,
  fisherStore,
} from '../fisher-packages';
import miningDataJson from '../fisher-packages/data/MiningData.json';

describe('FisherPackages', () => {
  test('should launch packages data', () => {
    expect(fisherStore.items.length).toBeGreaterThan(0);
    expect(fisherStore.Mining.items.length).toBeGreaterThan(0);
    expect(fisherStore.Mining.recipes.length).toBeGreaterThan(0);
    expect(fisherStore.Reiki.items.length).toBeGreaterThan(0);
    expect(fisherStore.Reiki.recipes.length).toBeGreaterThan(0);
    expect(fisherStore.Reiki.recipePartMap.size).toBeGreaterThan(0);
    expect(fisherStore.BattleAreas.length).toBeGreaterThan(0);
    expect(fisherStore.BattleEnemies.length).toBeGreaterThan(0);
  });
});

describe('FisherPackagesInterface', () => {
  test('should success find packages data', () => {
    expect(
      findFisherItemById(miningDataJson.data.items[0].id) instanceof FisherItem
    ).toBeTruthy();

    expect(
      findRecipeById(miningDataJson.data.recipes[0].id) instanceof
        FisherRecipeItem
    ).toBeTruthy();
  });

  test('find data should throw error when pass wrong id', () => {
    expect(() => findFisherItemById('WrongTestId')).toThrowError(
      'Could not find fisherItem id: WrongTestId'
    );

    expect(() => findRecipeById('WrongTestId')).toThrowError(
      'Could not find fisherItem id: WrongTestId'
    );
  });
});
