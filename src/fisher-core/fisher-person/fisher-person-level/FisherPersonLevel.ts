import invariant from 'invariant';
import { autorun, makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  EmptyLevelUpRequirements,
  EmptyRequirementsCompletion,
  IPersonLevelUpMethods,
  PersonLevel,
} from './Constants';
import {
  initializePersonLevelData,
  isAutoPersonLevelUp,
  isManualPersonLevelUp,
} from './Utils';

interface IFisherPersonLevel {
  level: PersonLevel;
  levelUpRequirementsCompletion?: IPersonLevelUpRequirementsCompletion;
}

export interface IPersonLevelUpRequirements {
  battleTimes: number;
  tasks: any[];
}

interface IPersonLevelUpRequirementsCompletion {
  battleTimes: number;
}

interface ILevelUpCompletionStatus {
  /**
   * 是否满足所有前置条件
   *
   * @type {boolean}
   * @memberof ILevelUpCompletionStatus
   */
  meetLevelUpRequirements: boolean;

  /**
   * 人物等级提升方式 手动 / 自动
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
  static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherPersonLevel');

  public initialized = false;
  /**
   * 人物境界
   *
   * @type {string}
   * @memberof FisherPersonLevel
   */
  public state?: string = undefined;

  public label?: string = undefined;

  public level?: PersonLevel = undefined;

  public nextLevel?: PersonLevel = undefined;

  /**
   * 等级属性系数
   *
   * @type {number}
   * @memberof FisherPersonLevel
   */
  public coefficient = 1;

  /**
   * 人物升级前置条件
   *
   * @type { IPersonLevelUpRequirements}
   * @memberof FisherPersonLevel
   */
  public levelUpRequirements: IPersonLevelUpRequirements =
    EmptyLevelUpRequirements;

  /**
   * 人物升级前置条件完成情况
   *
   * @type { IPersonLevelUpRequirementsCompletion}
   * @memberof FisherPersonLevel
   */
  public levelUpRequirementsCompletion: IPersonLevelUpRequirementsCompletion =
    EmptyRequirementsCompletion;

  constructor() {
    makeAutoObservable(this);
    autorun(() => this.requirementsCompletionProgress());
    reaction(() => this.level, this.levelChangeReaction);
  }

  public initialize = ({
    level,
    levelUpRequirementsCompletion,
  }: IFisherPersonLevel) => {
    if (this.initialized) {
      FisherPersonLevel.logger.error('Already initialized level');
      return;
    }
    this.level = level;
    this.levelUpRequirementsCompletion =
      levelUpRequirementsCompletion ?? EmptyRequirementsCompletion;
    this.initialized = true;
  };

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

  public manualLevelUp = () => {
    invariant(
      this.initialized === true,
      'Tried manual level up when person level does not initialized!'
    );
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
    invariant(
      this.initialized === true,
      'Tried updateBattleTimes when person level does not initialized!'
    );
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
    if (!this.level) return;

    const { state, label, nextLevel, coefficient, levelUpRequirements } =
      initializePersonLevelData(this.level);

    this.state = state;
    this.label = label;
    this.nextLevel = nextLevel;
    this.coefficient = coefficient;
    this.levelUpRequirements = levelUpRequirements;
    FisherPersonLevel.logger.info(`Success change level  to ${this.level}`);
  };
}
