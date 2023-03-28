import { EquipmentItem } from './EquipmentItem';
import { Item } from './Item';
import { HealPotion, PotionVariants } from './Potion';
import { RewardChest } from './RewardChest';

const isEquipmentItem = (item: Item | EquipmentItem): item is EquipmentItem => {
  return item instanceof EquipmentItem;
};

const isRewardChest = (item: Item | RewardChest): item is RewardChest => {
  return item instanceof RewardChest;
};

const isHealPotion = (potion: Item | PotionVariants): potion is HealPotion => {
  return potion instanceof HealPotion;
};

export { isEquipmentItem, isRewardChest, isHealPotion };
