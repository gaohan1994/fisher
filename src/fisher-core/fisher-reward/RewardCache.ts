import { makeAutoObservable } from 'mobx';
import { Reward } from './Reward';

interface ItemRewardCache {
  itemId: string;
  itemQuantity: number;
}

interface ICacheItemOptions {
  itemId: string;
  itemQuantity?: number;
}

class RewardCache {
  private experienceRewardCache = 0;

  private itemRewardCache = new Map<string, ItemRewardCache>();

  constructor() {
    makeAutoObservable(this);
  }

  public clearCache = () => {
    this.experienceRewardCache = 0;
    this.itemRewardCache.clear();
  };

  public cacheExperience = (experience: number) => {
    this.experienceRewardCache += experience;
  };

  public cacheItems = (items: ICacheItemOptions[]) => {
    items.forEach((item) => {
      if (this.itemRewardCache.has(item.itemId)) {
        const reward = this.itemRewardCache.get(item.itemId)!;
        reward.itemQuantity += item.itemQuantity ?? 1;
        this.itemRewardCache.set(item.itemId, reward);
      } else {
        this.itemRewardCache.set(item.itemId, { itemId: item.itemId, itemQuantity: item.itemQuantity ?? 1 });
      }
    });
  };

  public createRewards = (componentId: string) => {
    return [
      Reward.create({
        componentId,
        experience: this.experienceRewardCache,
      }),
      ...Array.from(this.itemRewardCache).map(([_, item]) => Reward.create(item)),
    ];
  };
}

export { RewardCache };
