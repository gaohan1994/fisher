import { FC, PropsWithChildren } from 'react';
import { Avatar, colors, Stack, Typography, Card, CardHeader, CardContent } from '@mui/material';
import { coinItem, Item } from '@FisherCore';
import { FuiColor, FuiSize } from '../theme';

interface FuiItemDetailProps {
  item: Item;
}

const FuiItemDetail: FC<PropsWithChildren<FuiItemDetailProps>> = ({ item, children }) => {
  return (
    <Card sx={{ bgcolor: FuiColor.item.background, width: FuiSize.item.detail }}>
      <CardHeader
        avatar={<Avatar src={item.media} variant="square" />}
        title={
          <Typography variant="body2" sx={{ color: colors.common.white }}>
            {item.name}
          </Typography>
        }
        subheader={
          typeof item.price === 'number' &&
          Number(item.price) > 0 && (
            <Stack direction="row" spacing={1}>
              <Avatar src={coinItem.media} sx={{ width: 20, height: 20 }} variant="square" />
              <Typography sx={{ color: FuiColor.gold }}>{item.price}</Typography>
            </Stack>
          )
        }
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

export { FuiItemDetail };
export type { FuiItemDetailProps };
