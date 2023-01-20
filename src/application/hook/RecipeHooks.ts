import { useMemo } from 'react';
import { store, Recipe, IRecipeItem, IRecipeRandomRewardItem, NormalItem } from '@FisherCore';

type IUseRecipeItem = [IRecipeItem, NormalItem];
type IUseRecipeRandomItem = [IRecipeRandomRewardItem, NormalItem];

interface IUseRecipe {
  recipe: Recipe;
  intervalSecond: number;
  rewardItems: IUseRecipeItem[];
  rewardItemAvatars: string[];
  randomRewardItems: IUseRecipeRandomItem[];
  randomRewardItemAvatars: string[];
}

const useRecipe = (recipe: Recipe): IUseRecipe => {
  const rewardItems: IUseRecipeItem[] = useMemo(
    () => recipe.rewardItems.map((item) => [item, store.findItemById(item.itemId)]),
    [recipe]
  );
  const rewardItemAvatars = useMemo(() => rewardItems.map(([_, item]) => item.media).filter(Boolean), [rewardItems]);

  const randomRewardItems: IUseRecipeRandomItem[] = useMemo(
    () => recipe.randomRewardItems.map((item) => [item, store.findItemById(item.itemId)]),
    [recipe]
  );
  const randomRewardItemAvatars = useMemo(
    () => randomRewardItems.map(([_, item]) => item.media).filter(Boolean),
    [randomRewardItems]
  );

  return {
    recipe,
    intervalSecond: recipe.interval / 1000,
    rewardItems,
    rewardItemAvatars,
    randomRewardItems,
    randomRewardItemAvatars,
  };
};

export { useRecipe };
export type { IUseRecipeItem, IUseRecipeRandomItem };
