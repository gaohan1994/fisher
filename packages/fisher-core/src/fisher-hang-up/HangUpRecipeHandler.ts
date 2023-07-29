import { makeAutoObservable } from 'mobx';
import { ComponentManager, FisherCore } from '../fisher-core/index.js';
import { Recipe } from '@item';
import { store } from '../fisher-packages/index.js';
import { Reward, RewardPool } from '@reward';
import { HangUpTime } from './HangUpTime.js';
import { MaxHangUpTimeMs } from './Constants.js';
import { ArchiveInterface } from '@archive';

class HangUpRecipeHandler {
  private state: ComponentManager | FisherCore;

  private componentId: string;

  public recipe: Recipe;

  constructor(
    state: ComponentManager | FisherCore,
    hangUpTime: HangUpTime,
    { activeRecipeId }: ArchiveInterface.ArchiveCollection,
    values: ArchiveInterface.ArchiveValues
  ) {
    makeAutoObservable(this);
    this.state = state;
    const { activeComponentId } = values;

    this.componentId = activeComponentId!;
    this.recipe = store.findRecipeById(activeRecipeId!);

    const hangUpRecipeTimes = Math.floor(Math.min(MaxHangUpTimeMs, hangUpTime.diff) / this.recipe.interval);

    if (hangUpRecipeTimes > 0) {
      const rewardPool = this.createMultipleRewards(hangUpRecipeTimes);
      rewardPool.executeRewardPool(true);
    }
  }

  private createMultipleRewards = (times: number) => {
    let rewardTimes = times;

    const rewardCostTimes = this.calculateRewardCostTimes();
    if (rewardCostTimes !== undefined) {
      rewardTimes = Math.min(rewardTimes, rewardCostTimes);
    }

    const rewardPool = new RewardPool();

    if (this.recipe.hasExperienceReward) {
      rewardPool.collectRewards([this.createExperienceReward(this.componentId, rewardTimes)]);
    }

    if (this.recipe.hasRewardItems) {
      rewardPool.collectRewards(this.createItemRewards(rewardTimes));
    }

    if (this.recipe.hasRandomRewardItems) {
      rewardPool.collectRewards(this.createRandomRewardItems(rewardTimes));
    }

    if (this.recipe.hasCostItems) {
      rewardPool.collectRewards(this.createCostItemRewards(rewardTimes));
    }

    return rewardPool;
  };

  /**
   * if recipe has cost
   * calculate the max reward times
   */
  private calculateRewardCostTimes = () => {
    const { backpack } = this.state;
    let result: number | undefined = undefined;

    if (!this.recipe.hasCostItems) {
      return result;
    }

    for (let index = 0; index < this.recipe.costItems!.length; index++) {
      const costItem = this.recipe.costItems![index];
      const backpackItem = backpack.getItemById(costItem.itemId);

      if (!backpackItem) {
        result = 0;
        break;
      }

      const bearTimes = Math.floor(backpackItem.quantity / costItem.itemQuantity);
      if (result === undefined) {
        result = bearTimes;
      } else {
        result = Math.min(result, bearTimes);
      }
    }

    return result;
  };

  private createItemRewards = (rewardTimes: number) =>
    this.recipe.rewardItems.map((rewardItem) =>
      Reward.create({
        itemId: rewardItem.itemId,
        itemQuantity: rewardItem.itemQuantity * rewardTimes,
      })
    );

  private createExperienceReward = (componentId: string, rewardTimes: number) =>
    Reward.create({
      componentId,
      experience: this.recipe.rewardExperience * rewardTimes,
    });

  private createRandomRewardItems = (rewardTimes: number) =>
    this.recipe.randomRewardItems
      .map((rewardItem) => {
        const randomItemRewardQuantity = Math.floor(
          rewardItem.itemQuantity * rewardTimes * (rewardItem.probability / 100)
        );

        if (randomItemRewardQuantity > 1) {
          return Reward.create({
            itemId: rewardItem.itemId,
            itemQuantity: randomItemRewardQuantity,
          });
        }

        return undefined;
      })
      .filter(Boolean) as Reward[];

  private createCostItemRewards = (rewardTimes: number) =>
    this.recipe.costItems!.map((costItem) =>
      Reward.create({
        itemId: costItem.itemId,
        itemQuantity: -(costItem.itemQuantity * rewardTimes),
      })
    );
}

export { HangUpRecipeHandler };
