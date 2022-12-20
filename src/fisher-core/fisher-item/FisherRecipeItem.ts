import { FisherItem, FisherItemType, IFisherItem } from './FisherItem';

export interface IFisherRecipeItem extends IFisherItem {
  interval: number;
  unlockLevel: number;
  rewardExperience: number;
  rewardItem: FisherItem;
  rewardQuantity?: number;
}

/**
 * 采集配方
 *
 * @export
 * @class FisherRecipeItem
 * @extends {FisherItem}
 */
export class FisherRecipeItem extends FisherItem {
  type = FisherItemType.Recipe;

  /**
   * 采集间隔
   *
   * @type {number}
   * @memberof FisherRecipeItem
   */
  public interval: number;

  /**
   * 解锁等级
   *
   * @type {number}
   * @memberof FisherRecipeItem
   */
  public unlockLevel: number;

  /**
   * - rewardExperience 经验奖励
   * - rewardQuantity 物品奖励数量
   * - rewardItem 物品奖励
   *
   * @type {number}
   * @memberof FisherRecipeItem
   */
  public rewardExperience: number;
  public rewardQuantity: number;
  public rewardItem: FisherItem;

  constructor(options: IFisherRecipeItem) {
    super(options);
    this.interval = options.interval;
    this.unlockLevel = options.unlockLevel;
    this.rewardItem = options.rewardItem;
    this.rewardExperience = options.rewardExperience;
    this.rewardQuantity = options.rewardQuantity ?? 1;
  }
}
