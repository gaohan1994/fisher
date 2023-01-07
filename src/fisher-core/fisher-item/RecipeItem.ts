import { Item, ItemType, IItem } from './Item';

export interface IRecipeItem extends IItem {
  interval: number;
  unlockLevel: number;
  rewardExperience?: number;
  rewardItems?: RecipeRewardItem[];
  randomRewardItems?: RecipeRandomRewardItem[];
}

interface RecipeRewardItem {
  itemId: string;
  itemQuantity: number;
}

interface RecipeRandomRewardItem extends RecipeRewardItem {
  probability: number;
}

/**
 * 采集配方
 *
 * @export
 * @class RecipeItem
 * @extends {Item}
 */
export class RecipeItem extends Item {
  type = ItemType.Recipe;

  public interval: number;

  public unlockLevel: number;

  public rewardExperience: number = 0;

  public get hasExperienceReward() {
    return this.rewardExperience > 0;
  }

  public rewardItems: RecipeRewardItem[] = [];

  public get hasRewardItems() {
    return this.rewardItems.length > 0;
  }

  public randomRewardItems: RecipeRandomRewardItem[] = [];

  public get hasRandomRewardItems() {
    return this.randomRewardItems.length > 0;
  }

  constructor(options: IRecipeItem) {
    super(options);
    this.interval = options.interval;
    this.unlockLevel = options.unlockLevel;

    if (options.rewardExperience) this.rewardExperience = options.rewardExperience;

    if (options.rewardItems) this.rewardItems = options.rewardItems;

    if (options.randomRewardItems) this.randomRewardItems = options.randomRewardItems;
  }
}
