import { CartItem } from '@FisherCore';
import { ModuleCard } from '../../components';
import { ItemInfo } from './Info';
import { FC } from 'react';
import { UpdateItemAction } from './UpdateItemAction';

interface FuiCartItemProps {
  item: CartItem;
}
export const FuiCartItem: FC<FuiCartItemProps> = ({ item }) => (
  <ModuleCard header={<ItemInfo item={item.item} />}>
    <UpdateItemAction item={item} />
  </ModuleCard>
);
