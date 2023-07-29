import { Recipe, store } from '@FisherCore';

/**
 * Return recipe first reward item icon
 * @param recipe
 */
export const useRecipeAvatar = (recipe: Recipe) => {
  const [firstRewardItem] = recipe.rewardItems;
  const { media } = store.findItemById(firstRewardItem.itemId);
  return media;
};
