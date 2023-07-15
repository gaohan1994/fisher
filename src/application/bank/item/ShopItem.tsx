import { FC } from 'react';
import { Item } from '@FisherCore';
import { ModuleCard } from '../../components';
import { AddItemAction } from './AddItemAction';
import { ItemInfo } from './Info';

interface FuiShopItemProps {
  item: Item;
}
export const FuiShopItem: FC<FuiShopItemProps> = ({ item }) => (
  <ModuleCard header={<ItemInfo item={item} />}>
    <AddItemAction item={item} />
  </ModuleCard>
);
