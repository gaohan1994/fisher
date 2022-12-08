import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { FisherTimer, FisherReward } from '@FisherCore';
import {
  calculateExperienceToLevel,
  calculateLevelExperienceInfo,
  LevelExperienceInfo,
} from './Experience';
import { FisherSkillRecipe } from './FisherSkillRecipe';
import invariant from 'invariant';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherSkill');

interface IFisherSkill {
  id: string;
  name: string;
  experience?: number;
}

/**
 * 增加技能经验值
 *
 * @interface IFisherSkillAddExperience
 */
interface IFisherSkillAddExperience {
  (value: number): void;
}

/**
 * 设置技能经验值
 *
 * @interface IFisherSkillSetExperience
 */
interface IFisherSkillSetExperience {
  (value: number): void;
}

type CalculateActionRewardCondition = [Set<FisherSkillRecipe>];

/**
 * 技能模块
 * 考虑到 mobx 的限制
 * 采用组合的方式而不是继承
 *
 * @export
 * @class FisherSkill
 */
export class FisherSkill {
  public id: string;
  public name: string;
  public experience: number;
  public selectedRecipes: Set<FisherSkillRecipe> = new Set();
  public disposes: IReactionDisposer[] = [];

  private timer: FisherTimer;
  private timerInterval: number;
  /**
   * 技能奖励
   *
   * @type {FisherReward}
   * @memberof FisherSkill
   */
  private fisherReward: FisherReward = new FisherReward();

  constructor({ id, name, experience }: IFisherSkill) {
    makeAutoObservable(this);
    logger.info('Initialize FisherSkill ', id);
    this.id = id;
    this.name = name;
    this.experience = experience ?? 0;
    this.timer = new FisherTimer({ id: this.id, action: () => this.action() });
    this.timerInterval = -Infinity;

    const calculateSkillActionRewardsDispose = reaction(
      () => [this.selectedRecipes] as CalculateActionRewardCondition,
      this._calculateSkillActionRewards
    );
    this.disposes.push(calculateSkillActionRewardsDispose);
  }

  public dispose = () => {
    this.disposes.forEach((disposeCallback) => disposeCallback());
  };

  public get level(): number {
    return calculateExperienceToLevel(this.experience);
  }

  /**
   * 计算出升级到下一级需要的经验和其他信息
   *
   * @readonly
   * @type {LevelExperienceInfo}
   * @memberof FisherSkill
   */
  public get levelExpInfo(): LevelExperienceInfo {
    return calculateLevelExperienceInfo(this.experience);
  }

  public addExperience: IFisherSkillAddExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience: IFisherSkillSetExperience = (value: number) => {
    this.experience = value;
  };

  public addSelectedRecipe = (value: FisherSkillRecipe) => {
    if (this.selectedRecipes.has(value)) {
      logger.info(`FisherSkill: ${this.id} already have recipe: ${value.name}`);
    }
    this.selectedRecipes.add(value);
  };

  public action = () => {
    logger.info(`Run skill action ${this.id}`);
    this.fisherReward.executeRewards();
  };

  /**
   * 开始执行技能
   *
   * @memberof FisherSkill
   */
  public startAction = () => {
    logger.info(`Start skill ${this.id}`);
    invariant(
      this.timerInterval > 0,
      `Fail to start skill ${this.id}, skill interval must > 0`
    );
    this.timer.startTimer(this.timerInterval);
  };

  /**
   * 结束执行技能
   *
   * @memberof FisherSkill
   */
  public stopAction = () => {
    logger.info(`Stop skill ${this.id}`);
    this.timer.stopTimer();
  };

  /**
   * 计算出每次执行技能之后的奖励
   *
   * @readonly
   * @memberof FisherSkill
   */
  private _calculateSkillActionRewards = ([
    selectedRecipes,
  ]: CalculateActionRewardCondition) => {
    let interval = 0;
    selectedRecipes.forEach((recipe) => {
      this.fisherReward.addRewardItem(recipe.rewardItem, recipe.rewardQuantity);
      this.fisherReward.addRewardSkill(this, recipe.rewardExperience);
      interval += recipe.interval;
    });
    this.timerInterval = interval;
  };
}
