import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { calculateLevelExperienceInfo, LevelExperienceInfo } from './Experience';
import { Timer } from '../fisher-timer';
import { Reward } from '../fisher-reward';
import { Recipe } from '../fisher-item';
import { RecipeHandler } from './RecipeHandler';

type IFisherSkillLevelInfo = LevelExperienceInfo;

class Skill {
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
    const executeRewards = this.createExecuteRewards();
    executeRewards.forEach((reward) => reward.execute());

    Skill.logger.debug(`${this.id} run action`);

    // after each action
    // check active recipe still available
    // if not meet condition stop timer
    // don't reset active recipe let user know the stop reason
    if (!this.activeRecipeAvailable) {
      Skill.logger.debug(`${this.id} stop action due to active recipe was unavailabled`);
      return this.stopTimer();
    }
  };

  public start = () => {
    if (!this.activeRecipeAvailable) {
      throw new Error(`Try to start skill ${this.id} but recipe was unavailabled`);
    }

    this.startTimer();
  };

  public stop = () => {
    this.stopTimer();
    this.resetActiveRecipe();
  };

  private createExecuteRewards = () => {
    return [...this.createRewards(), ...this.createCosts()];
  };

  private createRewards = (): Reward[] => {
    if (this.activeRecipe === undefined) {
      throw new Error('Try to create skill rewards but recipe was undefined!');
    }

    return this.recipeHandler.createRewards(this.activeRecipe);
  };

  private createCosts = (): Reward[] => {
    if (this.activeRecipe === undefined) {
      throw new Error('Try to create skill cost but recipe was undefined!');
    }

    return this.recipeHandler.createCosts(this.activeRecipe);
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
      throw new Error('Try to start action interval was 0 please select recipe');
    }

    this.timer.startTimer(this.activeRecipeInterval);
  };

  private stopTimer = () => {
    this.timer.stopTimer();
  };
}

export { Skill };
