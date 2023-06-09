import { ArchiveInterface } from '../fisher-archive';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { HangUpRecipeHandler } from '../fisher-hang-up/HangUpRecipeHandler';
import { Store } from '../fisher-packages';
import { HangUpTime, MaxHangUpTimeMs } from '../fisher-hang-up';
import { EventKeys, events } from '../fisher-events';
import { generateTimestamp } from '../utils';
import { FisherCoreError } from '../fisher-error';

abstract class Collection<CollectionPackages> {
  public abstract id: string;

  public abstract name: string;

  public abstract get packages(): CollectionPackages;

  public abstract skill: Skill;

  public get archive(): ArchiveInterface.ArchiveCollection {
    return {
      experience: this.skill.experience.experience,
      activeRecipeId: this.activeRecipe?.id,
    };
  }

  public get level() {
    return this.skill.experience.level;
  }

  public get experience() {
    return this.skill.experience.experience;
  }

  public get levelUpExperience() {
    return this.skill.experience.levelUpExperience;
  }

  public get isActive() {
    return this.skill.timer.active;
  }

  public get activeRecipe() {
    return this.skill.recipeHandler.activeRecipe;
  }

  private pauseTime: number | undefined = undefined;

  public get isPaused() {
    return this.pauseTime !== undefined;
  }

  abstract start(recipe?: Recipe): void;

  abstract stop(): void;

  abstract onLoadArchive(value: ArchiveInterface.ArchiveValues): void;

  public pause = () => {
    events.emit(EventKeys.Archive.SaveFullArchive);
    this.skill.timer.stopTimer();
    this.pauseTime = generateTimestamp();
  };

  public continue = async () => {
    if (this.pauseTime === undefined) {
      throw new FisherCoreError(
        `Try to continue component ${this.id}, but pause time was undefined`,
        '组件挂机失败，请检查挂机时间'
      );
    }

    if (this.activeRecipe === undefined) {
      throw new FisherCoreError(
        `Try to continue component ${this.id}, but active recipe was undefined`,
        '组件挂机失败，请检查技能配方'
      );
    }

    const { recipe } = await this.hangUp(new HangUpTime(this.pauseTime), this.activeRecipe.id);
    this.pauseTime = undefined;
    this.start(recipe);
  };

  public receiveExperience = (value: number) => {
    this.skill.experience.receiveExperience(value);
  };

  public setExperience = (value: number) => {
    this.skill.experience.setExperience(value);
  };

  /**
   * calculate hang up duration
   * calculate how many times should execute in hang up duration
   * execute rewards and return current info
   *
   * @author Harper.Gao
   * @param {HangUpTime} hangUpTime
   * @param {string} recipeId
   * @memberof Collection
   */
  public hangUp = async (hangUpTime: HangUpTime, recipeId: string) => {
    const recipe = Store.create().findRecipeById(recipeId);
    const diff = hangUpTime.diff;
    const times = Math.floor(Math.min(MaxHangUpTimeMs, diff) / recipe.interval);

    if (times > 0) {
      const hangUpRecipeHandler = new HangUpRecipeHandler(recipe);
      const rewardPool = hangUpRecipeHandler.createMultipleRewards(times, { componentId: this.id });
      rewardPool.executeRewardPool(true);
    }

    return await { recipe };
  };
}

export { Collection };
