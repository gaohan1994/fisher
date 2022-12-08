import invariant from 'invariant';
import { FisherItem, FisherSkillRecipe } from '@FisherCore';

/**
 * 根据 id 查找物品
 *
 * @export
 * @param {string} fisherItemId
 * @return {*}
 */
export function findFisherItemById(fisherItemId: string): FisherItem {
  const fisherItem = fisher.packagesData.items.find(
    (item) => item.id === fisherItemId
  );
  invariant(
    fisherItem !== undefined,
    'Could not find fisherItem id: ' + fisherItemId
  );
  return fisherItem;
}

/**
 * 根据 id 查找配方
 *
 * @export
 * @param {string} recipeId
 * @return {*}
 */
export function findRecipeById(recipeId: string): FisherSkillRecipe {
  const recipe = fisher.packagesData.recipes.find(
    (item) => item.id === recipeId
  );
  invariant(recipe !== undefined, 'Could not find recipe id: ' + recipeId);
  return recipe;
}
