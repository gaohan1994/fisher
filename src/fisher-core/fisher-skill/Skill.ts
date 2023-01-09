import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { calculateLevelExperienceInfo, LevelExperienceInfo } from './Experience';
import { Timer } from '../fisher-timer';
import { Reward } from '../fisher-reward';
import { Recipe } from '../fisher-item';
import { RecipeHandler } from './RecipeHandler';

type IFisherSkillLevelInfo = LevelExperienceInfo;

export class Skill {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Skill');

  public id: string;

  public experience = 0;

  public timer: Timer = new Timer('SkillTimer', () => this.action(), { showProgress: true });

  public get activeRecipeInterval() {
    return this.activeRecipe !== undefined ? this.activeRecipe.interval : 0;
  }

  public activeRecipe: Recipe | undefined = undefined;

  private recipeHandler = new RecipeHandler(this);

  public get hasActiveRecipe() {
    return this.activeRecipe !== undefined;
  }

  public get activeRecipeUnlockLevelRequirement() {
    return this.recipeHandler.checkRecipeUnlockLevelRequirement(this.activeRecipe);
  }

  public get activeRecipeBearCostAvailable() {
    return this.recipeHandler.checkRecipeCanBearCost(this.activeRecipe);
  }

  public get activeRecipeAvailable() {
    return this.hasActiveRecipe && this.activeRecipeUnlockLevelRequirement && this.activeRecipeBearCostAvailable;
  }

  constructor(id: string) {
    makeAutoObservable(this);
    this.id = id;
  }

  public get levelInfo(): IFisherSkillLevelInfo {
    return calculateLevelExperienceInfo(this.experience);
  }

  public get progress() {
    return this.timer.progress;
  }

  public action = () => {
    const rewards = this.createRewards();
    rewards.forEach((reward) => reward.executeRewards());
  };

  public start = () => {
    if (!this.activeRecipeAvailable) {
      return Skill.logger.error(`Try to start skill ${this.id} but recipe was unavailabled!`);
    }
    this.startTimer();
  };

  public stop = () => {
    this.resetActiveRecipe();
    this.stopTimer();
  };

  private createRewards = (): Reward[] => {
    if (this.activeRecipe === undefined)
      return Skill.logger.error('Try to create skill experience rewards with undefined recipe!');

    return this.recipeHandler.createRewards(this.activeRecipe);
  };

  public addExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience = (value: number) => {
    this.experience = value;
  };

  public setActiveRecipe = (value: Recipe) => {
    this.activeRecipe = value;
  };

  public resetActiveRecipe = () => {
    this.activeRecipe = undefined;
  };

  private startTimer = () => {
    if (this.activeRecipeInterval === 0) {
      return Skill.logger.error('Try to start action interval was 0 please select recipe');
    }
    this.timer.startTimer(this.activeRecipeInterval);
  };

  private stopTimer = () => {
    this.timer.stopTimer();
  };
}
