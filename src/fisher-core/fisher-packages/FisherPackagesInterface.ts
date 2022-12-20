import invariant from 'invariant';
import {
  FisherItem,
  FisherRecipeItem,
  FisherItemType,
  FisherEquipmentItem,
} from '@FisherCore';

type IFindItemReturnType<T> = T extends FisherEquipmentItem
  ? FisherEquipmentItem
  : FisherItem;

/**
 * 根据 id 查找物品
 *
 * @export
 * @param {string} fisherItemId
 * @return {*}
 */
export function findFisherItemById<T>(fisherItemId: string) {
  const fisherItem = fisher.packagesData.items.find(
    (item) => item.id === fisherItemId
  );
  invariant(
    fisherItem !== undefined,
    'Could not find fisherItem id: ' + fisherItemId
  );
  return fisherItem as IFindItemReturnType<T>;
}

/**
 * 查找某一类型的物品
 *
 * @export
 * @param {FisherItemType} fisherItemType
 * @return {*}
 */
export function findFisherItemsByType<T>(fisherItemType: FisherItemType) {
  const fisherItems: FisherItem[] = [];
  fisher.packagesData.items.map((item) => {
    if (item.type === fisherItemType) {
      fisherItems.push(item);
    }
  });
  return fisherItems as IFindItemReturnType<T>[];
}

/**
 * 根据 id 查找配方
 *
 * @export
 * @param {string} recipeId
 * @return {*}
 */
export function findRecipeById(recipeId: string): FisherRecipeItem {
  const recipe = fisher.packagesData.recipes.find(
    (item) => item.id === recipeId
  );
  invariant(recipe !== undefined, 'Could not find recipe id: ' + recipeId);
  return recipe;
}
