import { FC, PropsWithChildren } from 'react';
import { Item } from '@FisherCore';
import { Avatar, CardContent, CardHeader, Stack } from '@mui/material';

import { FuiCoin } from '../coin';
import { FuiItemName } from './Name';
import { useItemRarity } from './Hook';
import { FuiItemDescText, FuiItemDetailCard } from './Styled';

interface FuiItemDetailProps {
  item: Item;
}
export const FuiItemDetail: FC<PropsWithChildren<FuiItemDetailProps>> = ({ item, children }) => {
  const { desc, price } = item;
  const rarity = useItemRarity(item);
  const showCoin = Boolean(typeof item.price === 'number' && Number(price) > 0);
  return (
    <FuiItemDetailCard>
      <CardHeader
        subheader={rarity}
        avatar={<Avatar src={item.media} variant="square" />}
        title={<FuiItemName item={item} />}
      />
      <CardContent id="item-detail-card-content">
        <Stack spacing={1}>
          {children}
          <FuiItemDescText>{desc}</FuiItemDescText>
          {showCoin && <FuiCoin coin={price} />}
        </Stack>
      </CardContent>
    </FuiItemDetailCard>
  );
};
