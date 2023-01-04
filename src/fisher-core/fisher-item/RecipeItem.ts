import { FisherItem, ItemType, IFisherItem } from './FisherItem';

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
 * @class RecipeItem
 * @extends {FisherItem}
 */
export class RecipeItem extends FisherItem {
  type = ItemType.Recipe;

  /**
   * 采集间隔
   *
   * @type {number}
   * @memberof RecipeItem
   */
  public interval: number;

  /**
   * 解锁等级
   *
   * @type {number}
   * @memberof RecipeItem
   */
  public unlockLevel: number;

  /**
   * - rewardExperience 经验奖励
   * - rewardQuantity 物品奖励数量
   * - rewardItem 物品奖励
   *
   * @type {number}
   * @memberof RecipeItem
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
