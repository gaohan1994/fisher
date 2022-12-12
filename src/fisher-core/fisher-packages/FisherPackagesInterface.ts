import invariant from 'invariant';
import { FisherItem, FisherSkillRecipe, FisherItemType } from '@FisherCore';

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
 * 查找某一类型的物品
 *
 * @export
 * @param {FisherItemType} fisherItemType
 * @return {*}  {FisherItem[]}
 */
export function findFisherItemsByType(
  fisherItemType: FisherItemType
): FisherItem[] {
  const fisherItems: FisherItem[] = [];
  fisher.packagesData.items.map((item) => {
    if (item.type === fisherItemType) {
      fisherItems.push(item);
    }
  });
  return fisherItems;
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
