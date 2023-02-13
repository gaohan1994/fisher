import React, { FC, PropsWithChildren } from 'react';
import numeral from 'numeral';
import { Avatar, colors, Stack, Typography, Card, CardHeader, CardContent } from '@mui/material';
import { coinItem, Item } from '@FisherCore';
import { FuiColor } from '../theme';

interface FuiItemDetailProps {
  item: Item;
}
const FuiItemDetail: FC<PropsWithChildren<FuiItemDetailProps>> = ({ item, children }) => {
  return (
    <Card sx={{ bgcolor: FuiColor.item.background }}>
      <CardHeader
        avatar={<Avatar src={item.media} variant="square" />}
        title={
          <Typography variant="body2" sx={{ color: colors.common.white }}>
            {item.name}
          </Typography>
        }
        subheader={typeof item.price === 'number' && Number(item.price) > 0 && <FuiCoin price={item.price} />}
      />
      <CardContent sx={{ pt: 0 }}>
        {children}
        <Typography variant="caption" sx={{ color: FuiColor.item.desc }}>
          {item.desc}
        </Typography>
      </CardContent>
    </Card>
  );
};

interface FuiCoinProps {
  price: number;
}
const FuiCoin: React.FC<FuiCoinProps> = ({ price }) => (
  <Stack direction="row" spacing={1}>
    <Avatar src={coinItem.media} sx={{ width: 20, height: 20 }} variant="square" />
    <Typography sx={{ color: FuiColor.gold }}>{numeral(price).format('0,0')}</Typography>
  </Stack>
);

export { FuiItemDetail, FuiCoin };
export type { FuiItemDetailProps, FuiCoinProps };
