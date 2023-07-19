import { RecipeHandler } from '@FisherCore';

const InActiveRecipe = '请先选择锻造图纸';
const CanNotBearCost = '制作材料不足';
const UnlockLevel = '技能等级不足';

/**
 * Return recipe unavailable reason
 * @param recipeHandler
 * @returns
 */
export const useUnavaiableReason = (recipeHandler: RecipeHandler) => {
  let result: string = '';

  if (!recipeHandler.hasActiveRecipe) {
    result = InActiveRecipe;
  }

  if (!recipeHandler.activeRecipeUnlockLevelAvailable) {
    result = UnlockLevel;
  }

  if (!recipeHandler.activeRecipeBearCostAvailable) {
    result = CanNotBearCost;
  }

  return result;
};

export const useItemMeetCost = () => {};
