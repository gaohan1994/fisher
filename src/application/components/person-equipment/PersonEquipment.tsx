import { FC } from 'react';
import { EquipmentItem } from '@FisherCore';

import { FuiItem, FuiItemProps, ItemPopoverVariant } from '../item';
import { EquipmentDetail } from '../equipment';
import { Remove } from './Remove';

interface FuiPersonEquipmentProps extends Omit<FuiItemProps, 'item' | 'variant'> {
  item: EquipmentItem;
  variant?: ItemPopoverVariant;
}
export const FuiPersonEquipment: FC<FuiPersonEquipmentProps> = ({
  item,
  variant = ItemPopoverVariant.MouseOver,
  ...rest
}) => (
  <FuiItem
    {...rest}
    item={item}
    variant={variant}
    popover={
      <EquipmentDetail equipment={item}>
        <Remove equipment={item} />
      </EquipmentDetail>
    }
  />
);
