import { useMemo } from 'react';
import { Item, Recipe, store } from '@FisherCore';
import numeral from 'numeral';

const useRecipeRewardItems = (recipe: Recipe) =>
  useMemo(() => recipe.rewardItems.map((item) => store.findItemById(item.itemId)), [recipe.id]);

const useRecipeRewardRandomItems = (recipe: Recipe) =>
  useMemo(() => recipe.randomRewardItems.map((item) => store.findItemById(item.itemId)), [recipe.id]);

/**
 * Return all recipe icons
 * use set to make sure unique
 *
 * - reward item icons
 * - random reward item icons
 *
 * @param recipe
 */
export const useRecipeIcons = (recipe: Recipe) => {
  const set = new Set<string>();

  const items = useRecipeRewardItems(recipe);
  const randomItems = useRecipeRewardRandomItems(recipe);

  [...items, ...randomItems].forEach((item: Item) => set.add(item.media));

  return Array.from(set);
};

/**
 * Return display interval seconds
 * @param recipe
 * @returns
 */
export const useRecipeDisplayInterval = (recipe: Recipe) => {
  const { interval } = recipe;
  return `${numeral(interval / 1000).format('0.0')} 秒`;
};

/**
 * Return the passed recipe is locked
 * @param recipe
 * @param level
 */
export const useRecipeIsLocked = (recipe: Recipe, componentLevel: number) => {
  const { unlockLevel } = recipe;
  return useMemo(() => unlockLevel > componentLevel, [recipe.id, componentLevel]);
};
