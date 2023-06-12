import { IItem, Item, ItemType } from './Item';

interface IRewardChest extends IItem {
  rewardGold?: number;
  rewardItems?: Array<IRewardChestItemPayload>;
  componentId?: string;
  rewardExperience?: number;
  randomRewardItems?: Array<IRewardChestRandomItemPayload>;
}

interface IRewardChestItemPayload {
  itemId: string;
  itemQuantity: number;
}

interface IRewardChestRandomItemPayload extends IRewardChestItemPayload {
  probability: number;
}

class RewardChest extends Item {
  public readonly type = ItemType.RewardChest;

  public rewardItems: Array<IRewardChestItemPayload> = [];

  public randomRewardItems: Array<IRewardChestRandomItemPayload> = [];

  public componentId = 'Master';

  public rewardExperience = 0;

  public rewardGold: number | undefined = 0;

  constructor(options: IRewardChest) {
    super(options);

    if (options.rewardItems) {
      this.rewardItems = options.rewardItems;
    }
    if (options.componentId) {
      this.componentId = options.componentId;
    }
    if (options.rewardExperience) {
      this.rewardExperience = options.rewardExperience;
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
