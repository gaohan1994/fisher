import { FC } from 'react';
import { CardHeader } from '@mui/material';
import { Item } from '@FisherCore';
import { FuiCoin, FuiItem, FuiItemName } from '@Fui';

interface ItemInfoProps {
  item: Item;
}
export const ItemInfo: FC<ItemInfoProps> = ({ item }) => (
  <CardHeader
    avatar={<FuiItem item={item} />}
    title={<FuiItemName item={item} />}
    subheader={<FuiCoin price={item.price} />}
  />
);
