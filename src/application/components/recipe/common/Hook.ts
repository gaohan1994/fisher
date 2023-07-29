import { useMemo } from 'react';
import { Recipe, store } from '@FisherCore';
import numeral from 'numeral';

/**
 * Return all recipe reward items
 * @param recipe
 * @returns
 */
export const useRecipeRewardItems = (recipe: Recipe) =>
  useMemo(() => recipe.rewardItems.map((item) => [item, store.findItemById(item.itemId)] as const), [recipe.id]);

/**
 * Return all recipe random reward items
 * @param recipe
 * @returns
 */
export const useRecipeRewardRandomItems = (recipe: Recipe) =>
  useMemo(() => recipe.randomRewardItems.map((item) => [item, store.findItemById(item.itemId)] as const), [recipe.id]);

/**
 * Return recipe cost items
 * Return [] if does not have cost items
 * @param recipe
 * @returns
 */
export const useRecipeCostItems = (recipe: Recipe) =>
  useMemo(
    () =>
      recipe.hasCostItems ? recipe.costItems!.map((item) => [item, store.findItemById(item.itemId)] as const) : [],
    [recipe.id]
  );

/**
 * Return display interval seconds
 * @param recipe
 * @returns
 */
export const useRecipeDisplayInterval = (recipe: Recipe) => {
  const { interval } = recipe;
  return numeral(interval / 1000).format('0.0');
};
