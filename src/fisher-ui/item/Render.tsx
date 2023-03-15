import React from 'react';
import { isEquipmentItem, Item } from '@FisherCore';
import { FuiEquipment } from '../equipment';
import { FuiItem, FuiItemDetailPopover, FuiItemProps } from './Item';

interface Props<T = Item> extends Omit<FuiItemProps, 'item'> {
  item: T;
}
const FuiItemRender: React.FC<Props> = ({ item, ...rest }) => {
  const renderProps = {
    popover: FuiItemDetailPopover.None,
    showQuantity: true,
    ...rest,
  };

  if (isEquipmentItem(item)) {
    return <FuiEquipment {...renderProps} equipment={item} />;
  }

  return <FuiItem {...renderProps} item={item} />;
};

export { FuiItemRender };
