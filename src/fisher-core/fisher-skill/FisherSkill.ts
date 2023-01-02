import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { prefixLogger, prefixes } from '@FisherLogger';
import {
  FisherProgressTimer as FisherTimer,
  FisherReward,
  FisherRecipeItem,
} from '@FisherCore';
import {
  calculateLevelExperienceInfo,
  LevelExperienceInfo,
} from './Experience';
import {
  FisherCollectionSkillInfo,
  FisherCollectionSkillTypes,
} from './Constants';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherSkill');

export interface IFisherSkill {
  id: FisherCollectionSkillTypes;
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

type IFisherSkillLevelInfo = LevelExperienceInfo;

/**
 * 技能模块
 * 考虑到 mobx 的限制
 * 采用组合的方式而不是继承
 *
 * @export
 * @class FisherSkill
 */
export class FisherSkill {
  public id: FisherCollectionSkillTypes;
  public name: string;
  public experience: number;

  /**
   * 选中的配方
   *
   * @type {FisherRecipeItem}
   * @memberof FisherSkill
   */
  public activeRecipe?: FisherRecipeItem;

  /**
   * - timer 执行任务的定时器
   * - timerInterval 执行任务间隔
   * - actionRewards 每次执行任务发放的奖励
   *
   * @type {FisherTimer}
   * @memberof FisherSkill
   */
  public timer: FisherTimer;
  public timerInterval: number = 0;
  public actionRewards: FisherReward = new FisherReward();

  constructor({ id, experience }: IFisherSkill) {
    makeAutoObservable(this);
    logger.info('Initialize FisherSkill ', id);
    this.id = id;
    this.name = FisherCollectionSkillInfo[this.id]?.name ?? 'UnknowName';
    this.experience = experience ?? 0;
    this.timer = new FisherTimer(this.id, () => this.action());
  }

  /**
   * 计算出升级到下一级需要的经验和其他信息
   *
   * @readonly
   * @type {LevelExperienceInfo}
   * @memberof FisherSkill
   */
  public get levelInfo(): IFisherSkillLevelInfo {
    return calculateLevelExperienceInfo(this.experience);
  }

  /**
   * 技能进度
   *
   * @readonly
   * @memberof FisherSkill
   */
  public get progress() {
    return this.timer.progress;
  }

  public addExperience: IFisherSkillAddExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience: IFisherSkillSetExperience = (value: number) => {
    this.experience = value;
  };

  /**
   * 更新选中的配方
   * - 如果没有选中配方则设置为选中配方
   * - 如果当前已经有选中配方则替换
   *
   * @param {FisherRecipeItem} value
   * @memberof FisherSkill
   */
  public updateActiveRecipe = (value: FisherRecipeItem) => {
    if (this.activeRecipe !== undefined) {
      logger.info(`FisherSkill: ${this.id} replace recipe: ${value.name}`);
    }
    this.activeRecipe = value;
  };

  /**
   * 重置选中配方
   *
   * @memberof FisherSkill
   */
  public resetActiveRecipe = () => {
    this.activeRecipe = undefined;
  };

  public action = () => {
    logger.info(`Execute action ${this.id}`);
    this.actionRewards.executeRewards();
  };

  /**
   * 开始执行技能
   *
   * @memberof FisherSkill
   */
  public startAction = () => {
    this._initializeTimerAndRewards();
    this.timer.startTimer(this.timerInterval);
    logger.info(
      'Start skill: ' + this.id,
      'timer interval: ' + this.timerInterval
    );
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
   * 计算出 action 和 timer 执行的奖励和间隔
   *
   * @readonly
   * @memberof FisherSkill
   */
  private _initializeTimerAndRewards = () => {
    invariant(
      this.activeRecipe !== undefined,
      'Fail to initialize skill action, please set recipe!'
    );
    this.actionRewards.setRewardItem(
      this.activeRecipe.rewardItem,
      this.activeRecipe.rewardQuantity
    );
    this.actionRewards.setRewardSkill(this, this.activeRecipe.rewardExperience);
    this.timerInterval = this.activeRecipe.interval;
  };
}
