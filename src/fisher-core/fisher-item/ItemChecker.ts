import { EquipmentItem } from './EquipmentItem';
import { Item } from './Item';
import { RewardChest } from './RewardChest';

const isEquipmentItem = (item: Item | EquipmentItem): item is EquipmentItem => {
  return item instanceof EquipmentItem;
};

const isRewardChest = (item: Item | RewardChest): item is RewardChest => {
  return item instanceof RewardChest;
};

export { isEquipmentItem, isRewardChest };
