import { ArchiveInterface } from '../fisher-archive';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';
import { HangUpRecipeHandler } from '../fisher-hang-up/HangUpRecipeHandler';
import { HangUpTime } from '../fisher-hang-up';
import { EventKeys, events } from '@shared';
import { generateTimestamp } from '../utils';
import { FisherCoreError } from '@shared';
import { FisherCore } from '../fisher-core';

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

  public continue = async (core: FisherCore) => {
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

    const values = core.archiveManager.getActiveArchiveValues()!;
    const hangUpRecipeHandler = new HangUpRecipeHandler(
      core,
      new HangUpTime(this.pauseTime),
      values[this.id.toLocaleLowerCase() as 'mining' | 'reiki' | 'forge' | 'cook']!,
      values
    );
    this.pauseTime = undefined;
    this.start(hangUpRecipeHandler.recipe);
  };

  public receiveExperience = (value: number) => {
    this.skill.experience.receiveExperience(value);
  };

  public setExperience = (value: number) => {
    this.skill.experience.setExperience(value);
  };
}

export { Collection };
