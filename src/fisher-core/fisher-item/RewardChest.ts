import { IItem, Item, ItemType } from './Item';

interface IRewardChest extends IItem {
  rewardGold?: number;
  rewardItems?: Array<IRewardChestItemPayload>;
  rewardSkill?: IRewardChestExperiencePayload;
  randomRewardItems?: Array<IRewardChestRandomItemPayload>;
}

interface IRewardChestItemPayload {
  itemId: string;
  itemQuantity: number;
}

interface IRewardChestRandomItemPayload extends IRewardChestItemPayload {
  probability: number;
}

interface IRewardChestExperiencePayload {
  componentId: string;
  experience: number;
}

class RewardChest extends Item {
  public readonly type = ItemType.RewardChest;

  public rewardItems: Array<IRewardChestItemPayload> = [];

  public randomRewardItems: Array<IRewardChestRandomItemPayload> = [];

  public rewardSkill: IRewardChestExperiencePayload | undefined = undefined;

  public rewardGold: number | undefined = 0;

  constructor(options: IRewardChest) {
    super(options);

    if (options.rewardItems) {
      this.rewardItems = options.rewardItems;
    }
    if (options.rewardSkill) {
      this.rewardSkill = options.rewardSkill;
    }
    if (options.rewardGold) {
      this.rewardGold = options.rewardGold;
    }
    if (options.randomRewardItems) {
      this.randomRewardItems = options.randomRewardItems;
    }
  }
}

export { RewardChest };
export type { IRewardChest };
