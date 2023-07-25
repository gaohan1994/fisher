import { prefixLogger, prefixes } from '@fisher/logger';
import { Timer } from '../fisher-timer';
import { Recipe } from '../fisher-item';
import { RecipeHandler } from './RecipeHandler';
import { Experience } from '../fisher-experience';
import { FisherSkillError } from '../fisher-error';

class Skill {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Skill');

  public id: string;

  public experience = new Experience();

  public timer: Timer = new Timer('SkillTimer', () => this.action(), { showProgress: true });

  public get progress() {
    return this.timer.progress;
  }

  public recipeHandler = new RecipeHandler(this);

  constructor(id: string) {
    this.id = id;
  }

  public action = () => {
    this.recipeHandler.executeRecipe();

    // after each action
    // check active recipe still available
    // if not meet condition stop timer
    // don't reset active recipe let user know the stop reason
    if (!this.recipeHandler.activeRecipeAvailable) {
      this.stopTimer();
      throw new FisherSkillError(`${this.id} stop action due to active recipe was unavailabled`, '不满足配方条件');
    }
  };

  public start = () => {
    if (!this.recipeHandler.hasActiveRecipe) {
      throw new FisherSkillError('Try start skill without active recipe', '请先设置技能配方');
    }

    if (!this.recipeHandler.activeRecipeUnlockLevelAvailable) {
      throw new FisherSkillError(`Try start a unlock recipe`, '技能等级不足');
    }

    if (!this.recipeHandler.activeRecipeBearCostAvailable) {
      throw new FisherSkillError(`Try start recipe but can not bear costs`, '材料不足');
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

  public setActiveRecipe = (value: Recipe) => {
    this.recipeHandler.setActiveRecipe(value);
  };
}

export { Skill };
