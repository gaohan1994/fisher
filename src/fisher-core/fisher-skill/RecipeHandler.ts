import { backpack } from '../fisher-backpack';
import { Reward } from '../fisher-reward';
import { Recipe } from '../fisher-item';
import { Skill } from './Skill';

export class RecipeHandler {
  private skill: Skill;

  constructor(skill: Skill) {
    this.skill = skill;
  }

  public createRewards = (recipe: Recipe): Reward[] => {
    const rewards: Reward[] = [];

    const skillReward = this.createRecipeSkillReward(recipe);
    if (skillReward) rewards.push(skillReward);

    const itemsReward = this.createRecipeItemsRewards(recipe);
    if (itemsReward.length > 0) rewards.push(...itemsReward);

    const randomRewards = this.createRecipeRandomRewards(recipe);
    if (randomRewards.length > 0) rewards.push(...randomRewards);

    return rewards;
  };

  private createRecipeSkillReward = (recipe: Recipe): Reward | undefined => {
    if (recipe.hasExperienceReward) {
      return Reward.create({ skill: { skill: this.skill, experience: recipe.rewardExperience } });
    }

    return undefined;
  };

  private createRecipeItemsRewards = (recipe: Recipe): Reward[] => {
    const result: Reward[] = [];

    if (recipe.hasRewardItems) {
      recipe.rewardItems.forEach((rewardItem) => {
        const reward = Reward.create(rewardItem);
        result.push(reward);
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
    if (recipe === undefined) return false;
    return this.skill.levelInfo.level >= recipe.unlockLevel;
  };

  public checkRecipeCanBearCost = (recipe: Recipe | undefined): boolean => {
    if (recipe === undefined) return false;
    if (recipe.costItems === undefined) return true;

    for (let index = 0; index < recipe.costItems.length; index++) {
      const { itemId, itemQuantity } = recipe.costItems[index];

      if (!backpack.hasItem(itemId, itemQuantity)) return false;
    }

    return true;
  };
}
