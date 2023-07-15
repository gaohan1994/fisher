import { FC } from 'react';
import { Item, RarityName } from '@FisherCore';
import { useBackpack } from '../../core';
import { FuiColor } from '../theme';
import { ItemPopoverVariant } from './Constants';
import { usePopoverHoc } from './Hoc';
import { FuiItemProps } from './Item';

export const useItemPopoverHoc = (variant: ItemPopoverVariant = ItemPopoverVariant.MouseOver) => {
  return (Comp: FC<FuiItemProps>) => usePopoverHoc(Comp, variant);
};

/**
 * Return passed item backpack quantity
 * @param item
 * @returns
 */
export const useItemQuantity = (item: Item) => {
  const backpack = useBackpack();

  if (!backpack.checkItem(item)) return 0;
  return backpack.getItem(item)?.quantity ?? 0;
};

/**
 * Return item rarity label
 * @param item
 * @returns
 */
export const useItemRarity = (item: Item) => RarityName[item.rarity];

/**
 * Return item color filter by item rarity
 * @param item
 * @returns
 */
const useItemRarityColor = (item: Item) => FuiColor.item[item.rarity];

/**
 * Return item name and color
 * Cache with item.id
 * @param item
 * @returns
 */
export const useItemName = (item: Item) => ({ name: item.name, color: useItemRarityColor(item) });
