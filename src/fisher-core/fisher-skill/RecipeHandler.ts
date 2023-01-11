import { backpack } from '../fisher-backpack';
import { Reward } from '../fisher-reward';
import { Recipe } from '../fisher-item';
import { Skill } from './Skill';

class RecipeHandler {
  private skill: Skill;

  constructor(skill: Skill) {
    this.skill = skill;
  }

  public createRewards = (recipe: Recipe): Reward[] => {
    const result: Reward[] = [];

    const skillExperienceReward = this.createRecipeSkillExperienceReward(recipe);
    if (skillExperienceReward) {
      result.push(skillExperienceReward);
    }

    const itemsReward = this.createRecipeItemsRewards(recipe);
    if (itemsReward.length > 0) {
      result.push(...itemsReward);
    }

    const randomRewards = this.createRecipeRandomRewards(recipe);
    if (randomRewards.length > 0) {
      result.push(...randomRewards);
    }

    return result;
  };

  public createCosts = (recipe: Recipe): Reward[] => {
    let result: Reward[] = [];

    if (recipe.hasCostItems) {
      recipe.costItems!.forEach((item) => {
        result.push(Reward.create({ itemId: item.itemId, itemQuantity: -item.itemQuantity }));
      });
    }

    return result;
  };

  private createRecipeSkillExperienceReward = (recipe: Recipe): Reward | undefined => {
    if (!recipe.hasExperienceReward) {
      return undefined;
    }

    return Reward.create({ componentId: this.skill.id, experience: recipe.rewardExperience });
  };

  private createRecipeItemsRewards = (recipe: Recipe): Reward[] => {
    const result: Reward[] = [];

    if (recipe.hasRewardItems) {
      recipe.rewardItems.forEach((rewardItem) => {
        result.push(Reward.create(rewardItem));
      });
    }

    return result;
  };

  private createRecipeRandomRewards = (recipe: Recipe): Reward[] => {
    const result: Reward[] = [];

    if (recipe.hasRandomRewardItems) {
      recipe.randomRewardItems.forEach((rewardItem) => {
        const reward = Reward.createRandomReward(rewardItem.probability, rewardItem);
        if (reward !== undefined) result.push(reward);
      });
    }

    return result;
  };

  public checkRecipeUnlockLevelRequirement = (recipe: Recipe | undefined): boolean => {
    if (recipe === undefined) {
      return false;
    }

    return this.skill.levelInfo.level >= recipe.unlockLevel;
  };

  public checkRecipeCanBearCost = (recipe: Recipe | undefined): boolean => {
    if (recipe === undefined) {
      return false;
    }

    if (recipe.costItems === undefined) {
      return true;
    }

    for (let index = 0; index < recipe.costItems.length; index++) {
      const { itemId, itemQuantity } = recipe.costItems[index];

      if (!backpack.checkItemById(itemId, itemQuantity)) {
        return false;
      }
    }

    return true;
  };
}

export { RecipeHandler };
