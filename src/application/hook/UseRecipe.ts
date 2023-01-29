import { useMemo } from 'react';
import { store, Recipe, IRecipeItem, IRecipeRandomRewardItem, NormalItem, BackpackItem, core } from '@FisherCore';

type IUseRecipeItem = [IRecipeItem, NormalItem];
type IUseRecipeRandomItem = [IRecipeRandomRewardItem, NormalItem];
type IUseCostItem = [IRecipeItem, NormalItem];

interface IUseRecipe {
  recipe: Recipe;
  intervalSecond: number;
  rewardItems: IUseRecipeItem[];
  rewardItemAvatars: string[];
  randomRewardItems: IUseRecipeRandomItem[];
  randomRewardItemAvatars: string[];
  costItems: IUseCostItem[];
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

  const costItems: IUseCostItem[] = useMemo(
    () => (recipe.hasCostItems ? recipe.costItems!.map((item) => [item, store.findItemById(item.itemId)]) : []),
    [recipe]
  );

  return {
    recipe,
    intervalSecond: recipe.interval / 1000,
    rewardItems,
    rewardItemAvatars,
    randomRewardItems,
    randomRewardItemAvatars,
    costItems,
  };
};

export { useRecipe };
export type { IUseRecipeItem, IUseRecipeRandomItem, IUseCostItem };
