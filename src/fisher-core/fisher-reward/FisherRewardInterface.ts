import { findFisherItemById } from '../fisher-packages';
import { FisherReward } from './FisherReward';

interface ICreateReward {
  gold?: number;
  itemIds?: string[];
  itemQuantity?: number;
}

/**
 * 创建奖励
 *
 * @export
 * @param {ICreateReward} [{
 *   gold,
 *   items = [],
 *   itemIds = [],
 *   itemQuantity = 1,
 * }={}]
 * @return {*}  {FisherReward}
 */
export function createReward({
  gold,
  itemIds = [],
  itemQuantity = 1,
}: ICreateReward = {}): FisherReward {
  const reward = new FisherReward();

  if (gold !== undefined && typeof gold === 'number') {
    reward.addRewardGold(gold);
  }

  if (itemIds.length > 0) {
    itemIds.forEach((itemId) => {
      const item = findFisherItemById(itemId);
      reward.addRewardItem(item, itemQuantity);
    });
  }

  return reward;
}
