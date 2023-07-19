import { EquipmentItem, ItemType } from '@FisherCore';
import { FuiEquipment } from '../equipment';
import { FuiItem, FuiItemProps } from '../item';

export const renderItem = ({ item, ...rest }: FuiItemProps) => {
  switch (item.type) {
    case ItemType.Equipment:
      return <FuiEquipment item={item as EquipmentItem} {...rest} />;
    default:
      return <FuiItem item={item} {...rest} />;
  }
};
