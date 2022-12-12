import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { FisherItem, FisherItemType } from '../fisher-item';
import { FisherSkillRecipe } from '../fisher-skill';
import {
  findFisherItemById,
  findFisherItemsByType,
  findRecipeById,
} from '../fisher-packages';
import miningDataJson from '../fisher-packages/data/MiningData.json';

const fisher = new FisherCore();

vi.stubGlobal('fisher', fisher);

describe('FisherPackages', () => {
  test('should launch packages data', () => {
    expect(fisher.packagesData.items.length).toBeGreaterThan(0);
    expect(fisher.packagesData.recipes.length).toBeGreaterThan(0);
    expect(fisher.mining.packagesData.items.length).toBeGreaterThan(0);
    expect(fisher.mining.packagesData.recipes.length).toBeGreaterThan(0);
  });
});

describe('FisherPackagesInterface', () => {
  test('should success find packages data', () => {
    expect(
      findFisherItemById(miningDataJson.data.items[0].id) instanceof FisherItem
    ).toBeTruthy();

    expect(
      findRecipeById(miningDataJson.data.recipes[0].id) instanceof
        FisherSkillRecipe
    ).toBeTruthy();
  });

  test('find data should throw error when pass wrong id', () => {
    expect(() => findFisherItemById('WrongTestId')).toThrowError(
      'Could not find fisherItem id: WrongTestId'
    );

    expect(() => findRecipeById('WrongTestId')).toThrowError(
      'Could not find recipe id: WrongTestId'
    );
  });

  test('should find fisher items by item type', () => {
    expect(findFisherItemsByType(FisherItemType.Mining).length).toBeGreaterThan(
      0
    );
  });
});
