import { PotionVariant } from './Constants.js';
import { EquipmentItem } from './EquipmentItem.js';
import { Item } from './Item.js';
import { HealPotion, Potion } from './Potion.js';
import { RewardChest } from './RewardChest.js';

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
