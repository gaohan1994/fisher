import { FisherItem, FisherBaseItem, IFisherBaseItem } from '@FisherCore';

interface IFisherSkillRecipe extends IFisherBaseItem {
  interval: number;
  unlockLevel: number;
  rewardExperience: number;
  rewardItem: FisherItem;
  rewardQuantity?: number;
}

/**
 * 采集技能配方
 *
 * @export
 * @class FisherSkillRecipe
 * @extends {FisherBaseItem}
 */
export class FisherSkillRecipe extends FisherBaseItem {
  /**
   * 技能间隔
   *
   * @type {number}
   * @memberof FisherSkillRecipe
   */
  public interval: number;

  /**
   * 技能解锁等级
   *
   * @type {number}
   * @memberof FisherSkillRecipe
   */
  public unlockLevel: number;

  /**
   * - rewardExperience 经验奖励
   * - rewardQuantity 物品奖励数量
   * - rewardItem 物品奖励
   *
   * @type {number}
   * @memberof FisherSkillRecipe
   */
  public rewardExperience: number;
  public rewardQuantity: number;
  public rewardItem: FisherItem;

  constructor(options: IFisherSkillRecipe) {
    super(options);
    this.interval = options.interval;
    this.unlockLevel = options.unlockLevel;
    this.rewardItem = options.rewardItem;
    this.rewardExperience = options.rewardExperience;
    this.rewardQuantity = options.rewardQuantity ?? 1;
  }
}
