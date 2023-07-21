import { FC } from 'react';
import { EquipmentItem } from '@FisherCore';

import { FuiItem, FuiItemProps, ItemPopoverVariant } from '../item';
import { EquipmentDetail } from './EquipmentDetail';

export interface FuiEquipmentProps extends Omit<FuiItemProps, 'item' | 'variant'> {
  item: EquipmentItem;
  variant?: ItemPopoverVariant;
}
export const FuiEquipment: FC<FuiEquipmentProps> = ({ item, variant = ItemPopoverVariant.MouseOver, ...rest }) => (
  <FuiItem {...rest} item={item} variant={variant} popover={<EquipmentDetail equipment={item} />} />
);
