import { makeAutoObservable } from 'mobx';
import { EventEmitter } from 'smar-util';
import { BackpackItem, IRecipeItem, Recipe } from '../fisher-item';
import { EventKeys, events } from '../fisher-events';
import { Skill } from './Skill';
import { Reward } from '../fisher-reward';
import { backpack } from '../fisher-backpack';

enum RecipeEventKeys {
  UpdateActiveRecipeStatus = 'UpdateActiveRecipeStatus',
}

class RecipeHandler {
  private skill: Skill;

  public activeRecipe: Recipe | undefined = undefined;

  public costControlMap = new Map<string, RecipeCostItemControl>();

  public recipeEvents = new EventEmitter();

  constructor(skill: Skill) {
    makeAutoObservable(this);

    this.skill = skill;

    // listen backpack item update events
    // because the other skill reward may be recipe cost item
    // so re-calculate cost control when reward item
    this.recipeEvents.on(RecipeEventKeys.UpdateActiveRecipeStatus, this.onUpdateActiveRecipeStatus);
    events.on(EventKeys.Update.BackpackUpdate, this.onUpdateActiveRecipeStatus);
  }

  public get costControls() {
    return [...this.costControlMap.values()];
  }

  public get hasActiveRecipe() {
    return this.activeRecipe !== undefined;
  }

  public get activeRecipeAvailable() {
    return this.hasActiveRecipe && this.activeRecipeUnlockLevelAvailable && this.activeRecipeBearCostAvailable;
  }

  public get activeRecipeUnlockLevelAvailable() {
    if (!this.hasActiveRecipe) {
      return false;
    }

    return this.skill.levelInfo.level >= this.activeRecipe!.unlockLevel;
  }

  public get activeRecipeBearCostAvailable(): boolean {
    let result = true;

    this.costControlMap.forEach((control) => {
      if (!control.canBearCost) result = false;
    });

    return result;
  }

  public setActiveRecipe = (recipe: Recipe) => {
    this.activeRecipe = recipe;
    this.recipeEvents.emit(RecipeEventKeys.UpdateActiveRecipeStatus);
  };

  public resetActiveRecipe = () => {
    this.activeRecipe = undefined;
    this.recipeEvents.emit(RecipeEventKeys.UpdateActiveRecipeStatus);
  };

  public executeRecipe = () => {
    if (!this.activeRecipeAvailable) {
      throw new Error(`Try to executeRecipe but active recipe was unavailabled`);
    }

    const executeRewards = [...this.createRewards(), ...this.createCosts()];
    executeRewards.forEach((reward) => reward.execute());

    this.recipeEvents.emit(RecipeEventKeys.UpdateActiveRecipeStatus);
  };

  private createRewards = (): Reward[] => {
    if (!this.hasActiveRecipe) {
      throw new Error('Try to create rewards without active recipe!');
    }

    const result: Reward[] = [];

    const skillExperienceReward = this.createRecipeSkillExperienceReward();
    if (skillExperienceReward) {
      result.push(skillExperienceReward);
    }

    const itemsReward = this.createRecipeItemsRewards();
    if (itemsReward.length > 0) {
      result.push(...itemsReward);
    }

    const randomRewards = this.createRecipeRandomRewards();
    if (randomRewards.length > 0) {
      result.push(...randomRewards);
    }

    return result;
  };

  private createCosts = (): Reward[] => {
    if (!this.hasActiveRecipe) {
      throw new Error('Try to create costs without active recipe!');
    }

    let result: Reward[] = [];

    if (this.activeRecipe!.hasCostItems) {
      this.activeRecipe!.costItems!.forEach((item) => {
        result.push(Reward.create({ itemId: item.itemId, itemQuantity: -item.itemQuantity }));
      });
    }

    return result;
  };

  private createRecipeSkillExperienceReward = (): Reward | undefined => {
    if (!this.activeRecipe?.hasExperienceReward) {
      return undefined;
    }

    return Reward.create({ componentId: this.skill.id, experience: this.activeRecipe!.rewardExperience });
  };

  private createRecipeItemsRewards = (): Reward[] => {
    const result: Reward[] = [];

    if (this.activeRecipe!.hasRewardItems) {
      this.activeRecipe!.rewardItems.forEach((rewardItem) => result.push(Reward.create(rewardItem)));
    }

    return result;
  };

  private createRecipeRandomRewards = (): Reward[] => {
    const result: Reward[] = [];

    if (this.activeRecipe!.hasRandomRewardItems) {
      this.activeRecipe!.randomRewardItems.forEach((rewardItem) => {
        const reward = Reward.createRandomReward(rewardItem.probability, rewardItem);
        if (reward !== undefined) result.push(reward);
      });
    }

    return result;
  };

  private onUpdateActiveRecipeStatus = () => {
    this.updateActiveCostControl();
  };

  /**
   * update cost control
   *  - execute recipe
   *  - active recipe changed
   *  - backpack item changed
   *
   * clear cost control if active recipe = undefined or doesn't have costs
   * set cost control map if active recipe has cost items
   */
  private updateActiveCostControl = () => {
    if (!this.hasActiveRecipe) {
      return this.costControlMap.clear();
    }

    if (!this.activeRecipe!.hasCostItems) {
      return this.costControlMap.clear();
    }

    this.activeRecipe!.costItems!.forEach((item) => {
      this.costControlMap.set(item.itemId, new RecipeCostItemControl(item));
    });
  };
}

class RecipeCostItemControl {
  public canBearCost = false;
  public costItem: IRecipeItem;
  public backpackItem: BackpackItem | undefined = undefined;

  constructor(item: IRecipeItem) {
    this.costItem = item;
    this.backpackItem = backpack.getItemById(item.itemId);
    this.canBearCost = (this.backpackItem?.quantity ?? 0) >= item.itemQuantity;
  }
}

export { RecipeHandler };
