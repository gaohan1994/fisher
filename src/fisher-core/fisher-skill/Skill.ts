import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { calculateLevelExperienceInfo, LevelExperienceInfo } from './Experience';
import { Timer } from '../fisher-timer';
import { Reward } from '../fisher-reward';
import { RecipeItem } from '../fisher-item';

type IFisherSkillLevelInfo = LevelExperienceInfo;

export class Skill {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Skill');

  public id: string;

  public experience = 0;

  public timer: Timer = new Timer('SkillTimer', () => this.action(), { showProgress: true });

  public activeRecipe: RecipeItem | undefined = undefined;

  public get activeRecipeInterval() {
    return this.activeRecipe !== undefined ? this.activeRecipe.interval : 0;
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

  public start = (recipe: RecipeItem) => {
    this.updateActiveRecipe(recipe);
    this.startTimer();
  };

  public stop = () => {
    this.resetActiveRecipe();
    this.stopTimer();
  };

  private createRewards = (): Reward[] => {
    const rewards: Reward[] = [];

    const skillReward = this.createRecipeSkillReward();
    if (skillReward) rewards.push(skillReward);

    const itemsReward = this.createRecipeItemsRewards();
    if (itemsReward.length > 0) rewards.push(...itemsReward);

    const randomRewards = this.createRecipeRandomRewards();
    if (randomRewards.length > 0) rewards.push(...randomRewards);

    return rewards;
  };

  private createRecipeSkillReward = (): Reward | undefined => {
    if (this.activeRecipe === undefined)
      return Skill.logger.error('Try to create skill experience rewards with undefined recipe!');

    if (this.activeRecipe.hasExperienceReward) {
      return Reward.create({ skill: { skill: this, experience: this.activeRecipe.rewardExperience } });
    }

    return undefined;
  };

  private createRecipeItemsRewards = (): Reward[] => {
    if (this.activeRecipe === undefined) return Skill.logger.error('Try to create rewards with undefined recipe!');

    const result: Reward[] = [];

    if (this.activeRecipe.hasRewardItems) {
      this.activeRecipe.rewardItems.forEach((rewardItem) => {
        const reward = Reward.create(rewardItem);
        result.push(reward);
      });
    }

    return result;
  };

  private createRecipeRandomRewards = (): Reward[] => {
    if (this.activeRecipe === undefined)
      return Skill.logger.error('Try to create random rewards with undefined recipe!');

    const result: Reward[] = [];

    if (this.activeRecipe.hasRandomRewardItems) {
      this.activeRecipe.randomRewardItems.forEach((rewardItem) => {
        const reward = Reward.createRandomReward(rewardItem.probability, rewardItem);
        if (reward !== undefined) result.push(reward);
      });
    }

    return result;
  };

  public addExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience = (value: number) => {
    this.experience = value;
  };

  public updateActiveRecipe = (value: RecipeItem) => {
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
