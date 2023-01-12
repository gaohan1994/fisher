import { prefixLogger, prefixes } from '@FisherLogger';
import { calculateLevelExperienceInfo, LevelExperienceInfo } from './Experience';
import { Timer } from '../fisher-timer';
import { Recipe } from '../fisher-item';
import { RecipeHandler } from './RecipeHandler';

type IFisherSkillLevelInfo = LevelExperienceInfo;

class Skill {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Skill');

  public id: string;

  public experience = 0;

  public timer: Timer = new Timer('SkillTimer', () => this.action(), { showProgress: true });

  public recipeHandler = new RecipeHandler(this);

  constructor(id: string) {
    this.id = id;
  }

  public get levelInfo(): IFisherSkillLevelInfo {
    return calculateLevelExperienceInfo(this.experience);
  }

  public get progress() {
    return this.timer.progress;
  }

  public action = () => {
    this.recipeHandler.executeRecipe();
    Skill.logger.debug(`${this.id} run action`);

    // after each action
    // check active recipe still available
    // if not meet condition stop timer
    // don't reset active recipe let user know the stop reason
    if (!this.recipeHandler.activeRecipeAvailable) {
      Skill.logger.debug(`${this.id} stop action due to active recipe was unavailabled`);
      return this.stopTimer();
    }
  };

  public start = () => {
    if (!this.recipeHandler.activeRecipeAvailable) {
      throw new Error(`Try to start skill ${this.id} but recipe was unavailabled`);
    }

    this.startTimer();
  };

  private startTimer = () => {
    if (!this.recipeHandler.hasActiveRecipe) {
      throw new Error('Try to start action without active recipe!');
    }

    this.timer.startTimer(this.recipeHandler.activeRecipe!.interval);
  };

  public stop = () => {
    this.stopTimer();
    this.recipeHandler.resetActiveRecipe();
  };

  private stopTimer = () => {
    this.timer.stopTimer();
  };

  public addExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience = (value: number) => {
    this.experience = value;
  };

  public setActiveRecipe = (value: Recipe) => {
    this.recipeHandler.setActiveRecipe(value);
  };
}

export { Skill };
