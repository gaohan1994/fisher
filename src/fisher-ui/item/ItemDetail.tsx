import { FC, PropsWithChildren } from 'react';
import { Avatar, Typography, Card, CardHeader, CardContent, Box } from '@mui/material';
import { Item, RarityName } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiCoin, FuiItemName } from './Items';

interface FuiItemDetailProps {
  item: Item;
}
const FuiItemDetail: FC<PropsWithChildren<FuiItemDetailProps>> = ({ item, children }) => (
  <Card sx={{ bgcolor: FuiColor.item.background, position: 'relative', minWidth: 200, maxWidth: 300 }}>
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

export { FuiItemDetail };
export type { FuiItemDetailProps };
