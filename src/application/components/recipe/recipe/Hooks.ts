import { useMemo } from 'react';
import { Recipe } from '@FisherCore';
import { useRecipeRewardItems, useRecipeRewardRandomItems } from '../common';

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
  const items = useRecipeRewardItems(recipe);
  const randomItems = useRecipeRewardRandomItems(recipe);

  const set = new Set<string>();
  [...items, ...randomItems].forEach(([_, item]) => set.add(item.media));

  return Array.from(set);
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
