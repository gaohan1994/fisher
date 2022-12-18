import invariant from 'invariant';
import { makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { PersonLevel } from './Constants';
import {
  IFisherPersonLevelUpRequirements,
  initializePersonLevelData,
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
  /**
   * 战斗胜利次数
   *
   * @type {number}
   * @memberof IFisherPersonLevel
   */
  battleTimes?: number;
}

/**
 * 等级模块
 * 升级规则
 * - 和同级或者同级以上境界的人物战斗，每次战斗胜利 +1 战斗次数
 * - 战斗胜利次数大于等于当前境界所需要的战斗次数
 *    - 如果当前等级没有特殊升级任务，则升级 [tasks.length === 0]
 *    - 如果当前等级需要特殊升级任务，则需要完成任务后手动升级 [tasks.length > 0]
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
   * 战斗获胜次数
   *
   * @type {number}
   * @memberof FisherPersonLevel
   */
  public battleTimes: number;

  /**
   * 人物升级前置条件
   *
   * @type {IFisherPersonLevelUpRequirements}
   * @memberof FisherPersonLevel
   */
  public levelUpRequirements: IFisherPersonLevelUpRequirements;

  constructor({ level, battleTimes }: IFisherPersonLevel) {
    makeAutoObservable(this);
    this.level = level;
    this.battleTimes = battleTimes ?? 0;

    const { state, label, nextLevel, coefficient, levelUpRequirements } =
      initializePersonLevelData(level);
    this.state = state;
    this.label = label;
    this.nextLevel = nextLevel;
    this.coefficient = coefficient;
    this.levelUpRequirements = levelUpRequirements;

    reaction(() => this.level, this.levelChangeReaction);
  }

  /**
   * 是否可以升级
   *
   * @readonly
   * @type {Boolean}
   * @memberof FisherPersonLevel
   */
  public get canLevelUp(): Boolean {
    return this.battleTimes >= this.levelUpRequirements.battleTimes;
  }

  /**
   * 提升等级
   * - 战斗次数清零
   * - 等级+1
   *
   * @memberof FisherPersonLevel
   */
  public onLevelUp = () => {
    invariant(
      this.canLevelUp === true,
      'Fail to level up, please check current level up process'
    );
    this.battleTimes = 0;
    this.level = this.nextLevel;
  };

  /**
   * 更新战斗胜利次数
   *
   * @param {number} quantity
   * @memberof FisherPersonLevel
   */
  public updateBattleTimes = (quantity: number) => {
    this.battleTimes += quantity;
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
