import { Item, ItemType, IItem } from './Item';

interface IRecipe extends IItem {
  interval: number;
  unlockLevel: number;
  rewardExperience?: number;
  rewardItems?: IRecipeItem[];
  randomRewardItems?: IRecipeRandomRewardItem[];
  costItems?: IRecipeItem[];
}

interface IRecipeItem {
  itemId: string;
  itemQuantity: number;
}
interface IRecipeRandomRewardItem extends IRecipeItem {
  probability: number;
}

/**
 * 采集配方
 *
 * @export
 * @class Recipe
 * @extends {Item}
 */
class Recipe extends Item {
  type = ItemType.Recipe;

  public interval: number;

  public unlockLevel: number;

  public rewardExperience: number = 0;

  public get hasExperienceReward() {
    return this.rewardExperience > 0;
  }

  public rewardItems: IRecipeItem[] = [];

  public get hasRewardItems() {
    return this.rewardItems.length > 0;
  }

  public randomRewardItems: IRecipeRandomRewardItem[] = [];

  public get hasRandomRewardItems() {
    return this.randomRewardItems.length > 0;
  }

  public costItems: IRecipeItem[] | undefined = undefined;

  public get hasCostItems() {
    return this.costItems !== undefined;
  }

  constructor(options: IRecipe) {
    super(options);
    this.interval = options.interval;
    this.unlockLevel = options.unlockLevel;

    if (options.rewardExperience) this.rewardExperience = options.rewardExperience;

    if (options.rewardItems) this.rewardItems = options.rewardItems;

    if (options.randomRewardItems) this.randomRewardItems = options.randomRewardItems;

    if (options.costItems) this.costItems = options.costItems;
  }
}

export { Recipe };
export type { IRecipe, IRecipeItem, IRecipeRandomRewardItem };
