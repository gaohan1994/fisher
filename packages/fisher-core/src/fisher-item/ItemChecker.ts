import { EquipmentItem } from './EquipmentItem';
import { Item } from './Item';
import { HealPotion, Potion, PotionVariant } from './Potion';
import { RewardChest } from './RewardChest';

const isEquipmentItem = (item: Item | EquipmentItem): item is EquipmentItem => {
  return item instanceof EquipmentItem;
};

const isRewardChest = (item: Item | RewardChest): item is RewardChest => {
  return item instanceof RewardChest;
};

const isPotion = (potion: Item | Potion): potion is Potion => {
  return potion instanceof Potion;
};

const isHealPotion = (potion: Item | Potion): potion is HealPotion => {
  return isPotion(potion) && potion.variant === PotionVariant.HealPotion;
};

export { isEquipmentItem, isRewardChest, isPotion, isHealPotion };
