import { findFisherItemById } from '../fisher-packages';
import { checkHitProbability } from '../utils';
import { Reward } from './Reward';

interface ICreateReward {
  gold?: number;
  itemId?: string;
  itemIds?: string[];
  itemQuantity?: number;
}

/**
 * 创建奖励
 * @return {*}  {Reward}
 */
export function createReward({
  gold,
  itemId = undefined,
  itemIds = [],
  itemQuantity = 1,
}: ICreateReward = {}): Reward {
  const reward = new Reward();

  if (gold !== undefined && typeof gold === 'number') {
    reward.addRewardGold(gold);
  }

  if (itemId !== undefined) {
    const item = findFisherItemById(itemId);
    item && reward.addRewardItem(item, itemQuantity);
  }

  if (itemIds.length > 0) {
    itemIds.forEach((id) => {
      const item = findFisherItemById(id);
      item && reward.addRewardItem(item, itemQuantity);
    });
  }

  return reward;
}

interface IProvideProbabilityReward {
  gold?: number;
  itemId: string;
  probability: number;
  itemQuantity?: number;
}

/**
 * roll 点决定是否生成奖励
 *
 * @param {string} itemId 奖励物品id
 * @param {number} itemQuantity 物品奖励数量默认 1
 * @param {number} probability 概率 0 - 100
 */
export function provideProbabilityReward({
  gold = 0,
  itemId,
  probability = 100,
  itemQuantity = 1,
}: IProvideProbabilityReward): Reward | undefined {
  if (!checkHitProbability(probability)) return undefined;
  return createReward({ gold, itemIds: [itemId], itemQuantity });
}
