import React, { FC, PropsWithChildren } from 'react';
import numeral from 'numeral';
import { Avatar, Stack, Typography, Card, CardHeader, CardContent, Box } from '@mui/material';
import { coinItem, Item, RarityName } from '@FisherCore';
import { FuiColor } from '../theme';

interface IFuiItemName {
  item: Item;
}
const FuiItemName: FC<IFuiItemName> = ({ item }) => (
  <Typography variant="body2" sx={{ color: FuiColor.item[item.rarity], fontWeight: 'bold' }}>
    {item.name}
  </Typography>
);
interface FuiItemDetailProps {
  item: Item;
}
const FuiItemDetail: FC<PropsWithChildren<FuiItemDetailProps>> = ({ item, children }) => (
  <Card sx={{ bgcolor: FuiColor.item.background, position: 'relative' }}>
    <CardHeader
      avatar={<Avatar src={item.media} variant="square" />}
      subheader={RarityName[item.rarity]}
      title={<FuiItemName item={item} />}
    />
    <CardContent sx={{ pt: 0 }}>
      {children}
      <Typography variant="caption" sx={{ color: FuiColor.item.desc }}>
        {item.desc}
      </Typography>
      {typeof item.price === 'number' && Number(item.price) > 0 && (
        <Box sx={{ mt: 1 }}>
          <FuiCoin price={item.price} />
        </Box>
      )}
    </CardContent>
  </Card>
);

interface FuiCoinProps {
  price: number;
}
const FuiCoin: React.FC<FuiCoinProps> = ({ price }) => (
  <Stack direction="row" spacing={1}>
    <Avatar src={coinItem.media} sx={{ width: 20, height: 20 }} variant="square" />
    <Typography sx={{ color: FuiColor.gold }}>{numeral(price).format('0,0')}</Typography>
  </Stack>
);

export { FuiItemName, FuiItemDetail, FuiCoin };
export type { FuiItemDetailProps, FuiCoinProps };
