import invariant from 'invariant';
import { autorun, makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { IPersonLevelUpMethods, PersonLevel } from './Constants';
import {
  IFisherPersonLevelUpRequirements,
  initializePersonLevelData,
  isAutoPersonLevelUp,
  isManualPersonLevelUp,
} from './Utils';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherPersonLevel');

interface IFisherPersonLevel {
  /**
   * 初始等级
   *
   * @type {PersonLevel}
   * @memberof IFisherPersonLevel
   */
  level: PersonLevel;
  levelUpRequirementsCompletion?: IFisherPersonLevelUpRequirementsCompletion;
}

/**
 * 人物已完成的升级所需要的前置条件
 *
 * @interface IFisherPersonLevelUpRequirementsCompletion
 */
interface IFisherPersonLevelUpRequirementsCompletion {
  /**
   * 战斗胜利次数
   *
   * @type {number}
   * @memberof IFisherPersonLevel
   */
  battleTimes: number;
}

const EmptyRequirementsCompletion: IFisherPersonLevelUpRequirementsCompletion =
  { battleTimes: 0 };

/**
 * 人物升级前置条件完成情况
 *
 * @interface ILevelUpCompletionStatus
 */
interface ILevelUpCompletionStatus {
  /**
   * 是否满足所有前置条件
   *
   * @type {boolean}
   * @memberof ILevelUpCompletionStatus
   */
  meetLevelUpRequirements: boolean;

  /**
   * 人物等级提升方式
   *
   * @type {IPersonLevelUpMethods}
   * @memberof ILevelUpCompletionStatus
   */
  levelUpMethod: IPersonLevelUpMethods;
}

/**
 * 等级模块
 * 升级规则
 * - 和同级或者同级以上境界的人物战斗，每次战斗胜利 +1 战斗次数
 * - 战斗胜利次数大于等于当前境界所需要的战斗次数
 *    - 如果当前等级没有特殊升级任务，则升级
 *    - 如果当前等级需要特殊升级任务，则需要完成任务后手动升级
 * 升级后
 * 战斗次数清零
 * 等级 +1
 *
 * @export
 * @class FisherPersonLevel
 */
export class FisherPersonLevel {
  /**
   * 人物境界
   *
   * @type {string}
   * @memberof FisherPersonLevel
   */
  public state: string;

  /**
   * 人物等级描述
   *
   * @type {string}
   * @memberof FisherPersonLevel
   */
  public label: string;

  /**
   * 人物境界中的具体等级
   *
   * @type {PersonLevel}
   * @memberof FisherPersonLevel
   */
  public level: PersonLevel;

  /**
   * 人物等级系数
   *
   * @type {number}
   * @memberof FisherPersonLevel
   */
  public coefficient: number;

  /**
   * 人物下一等级
   *
   * @type {PersonLevel}
   * @memberof FisherPersonLevel
   */
  public nextLevel: PersonLevel;
  /**
   * 人物升级前置条件
   *
   * @type {IFisherPersonLevelUpRequirements}
   * @memberof FisherPersonLevel
   */
  public levelUpRequirements: IFisherPersonLevelUpRequirements;

  /**
   * 人物升级前置条件完成情况
   *
   * @type {IFisherPersonLevelUpRequirementsCompletion}
   * @memberof FisherPersonLevel
   */
  public levelUpRequirementsCompletion: IFisherPersonLevelUpRequirementsCompletion;

  constructor({ level, levelUpRequirementsCompletion }: IFisherPersonLevel) {
    makeAutoObservable(this);
    this.level = level;
    this.levelUpRequirementsCompletion =
      levelUpRequirementsCompletion ?? EmptyRequirementsCompletion;

    const { state, label, nextLevel, coefficient, levelUpRequirements } =
      initializePersonLevelData(level);
    this.state = state;
    this.label = label;
    this.nextLevel = nextLevel;
    this.coefficient = coefficient;
    this.levelUpRequirements = levelUpRequirements;

    autorun(() => this.requirementsCompletionProgress());
    reaction(() => this.level, this.levelChangeReaction);
  }

  /**
   * 是否可以升级
   *
   * @readonly
   * @type {Boolean}
   * @memberof FisherPersonLevel
   */
  public get levelUpCompletionStatus(): ILevelUpCompletionStatus {
    const isMeetBattleTimes =
      this.levelUpRequirementsCompletion.battleTimes >=
      this.levelUpRequirements.battleTimes;

    return {
      meetLevelUpRequirements: isMeetBattleTimes,
      // 如果升级前置条件中有特殊任务
      // 则升级方式必须为手动
      // 如果升级前置条件只有战斗获胜次数
      // 则可以自动升级
      levelUpMethod:
        this.levelUpRequirements.tasks.length > 0
          ? IPersonLevelUpMethods.Manual
          : IPersonLevelUpMethods.Auto,
    };
  }

  /**
   * 手动升级
   *
   * @memberof FisherPersonLevel
   */
  public manualLevelUp = () => {
    invariant(
      isManualPersonLevelUp(this.levelUpCompletionStatus.levelUpMethod),
      `Fail to manual level up, current level ${this.level} should level up automaticaly`
    );
    invariant(
      this.levelUpCompletionStatus.meetLevelUpRequirements === true,
      'Fail to level up, please check current level up process'
    );
    this.resetLevelUpRequirementsCompletion();
    this.level = this.nextLevel;
  };

  /**
   * 自动升级
   *
   * @memberof FisherPersonLevel
   */
  public autoLevelUp = () => {
    invariant(
      isAutoPersonLevelUp(this.levelUpCompletionStatus.levelUpMethod),
      `Fail to auto level up, current level ${this.level} should level up manualy`
    );
    invariant(
      this.levelUpCompletionStatus.meetLevelUpRequirements === true,
      'Fail to level up, please check current level up process'
    );
    this.resetLevelUpRequirementsCompletion();
    this.level = this.nextLevel;
  };

  /**
   * 更新战斗胜利次数
   *
   * @param {number} quantity
   * @memberof FisherPersonLevel
   */
  public updateBattleTimes = (quantity: number) => {
    this.levelUpRequirementsCompletion.battleTimes += quantity;
  };

  /**
   * 清空人物升级进度
   *
   * @memberof FisherPersonLevel
   */
  public resetLevelUpRequirementsCompletion = () => {
    this.levelUpRequirementsCompletion = EmptyRequirementsCompletion;
  };

  /**
   * 升级前置条件完成进度监听事件
   * 当前置条件只有战斗次数的时候，如果满足获胜战斗次数 >= 需要的战斗次数则升级
   * 如果前置条件还有特殊人物则需要手动升级
   *
   * @private
   * @memberof FisherPersonLevel
   */
  private requirementsCompletionProgress = () => {
    const { meetLevelUpRequirements, levelUpMethod } =
      this.levelUpCompletionStatus;
    if (isAutoPersonLevelUp(levelUpMethod) && meetLevelUpRequirements) {
      this.autoLevelUp();
    }
  };

  /**
   * 人物等级变化处理函数
   *
   * @private
   * @memberof FisherPersonLevel
   */
  private levelChangeReaction = () => {
    const { state, label, nextLevel, coefficient, levelUpRequirements } =
      initializePersonLevelData(this.level);
    logger.info(`Success change level  to ${this.level}`);
    this.state = state;
    this.label = label;
    this.nextLevel = nextLevel;
    this.coefficient = coefficient;
    this.levelUpRequirements = levelUpRequirements;
  };
}
