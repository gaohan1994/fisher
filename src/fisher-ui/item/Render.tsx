import React from 'react';
import { isEquipmentItem, Item } from '@FisherCore';
import { FuiItem, FuiItemDetailPopover, FuiItemProps } from './Item';
import { FuiEquipment, FuiEquipmentDetail } from './equipment';
import { FuiItemDetail } from './ItemDetail';

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

interface IFuiItemDetailRender {
  item: Item;
}
const FuiItemDetailRender: React.FC<IFuiItemDetailRender> = ({ item }) => {
  if (isEquipmentItem(item)) {
    return (
      <FuiItemDetail item={item}>
        <FuiEquipmentDetail equipment={item} />
      </FuiItemDetail>
    );
  }

  return <FuiItemDetail item={item} />;
};

export { FuiItemRender, FuiItemDetailRender };
