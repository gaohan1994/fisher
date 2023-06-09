import { FC } from 'react';
import numeral from 'numeral';
import { Avatar, Box, Stack, Typography, TypographyProps } from '@mui/material';
import { Item, coinItem } from '@FisherCore';
import { FuiColor, FuiSize } from '../theme';
import { FuiItem, FuiItemProps } from './Item';

interface IFuiItemName extends TypographyProps {
  item: Item;
}
const FuiItemName: FC<IFuiItemName> = ({ item, ...rest }) => (
  <Typography
    variant="inherit"
    component="span"
    {...rest}
    sx={{ ...(rest.sx ?? {}), color: FuiColor.item[item.rarity], fontWeight: 'bold' }}
  >
    {item.name}
  </Typography>
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

const FuiEmptyItem: React.FC = () => (
  <Box
    sx={{
      border: 1,
      borderColor: FuiColor.item.borderColor,
      position: 'relative',
      width: FuiSize.item.size,
      height: FuiSize.item.size,
      bgcolor: FuiColor.item.background,
    }}
  />
);

interface FuiGoldItemProps extends Omit<FuiItemProps, 'item'> {
  gold: number;
}
const FuiGoldItem: React.FC<FuiGoldItemProps> = ({ gold, ...rest }) => (
  <FuiItem item={coinItem} showQuantity quantity={gold} {...rest} />
);

interface FuiExperienceItemProps extends Omit<FuiItemProps, 'item'> {
  componentId: string;
  experience: number;
}
const FuiExperienceItem: React.FC<FuiExperienceItemProps> = ({ componentId, experience, ...rest }) => (
  <FuiItem item={coinItem} showQuantity quantity={experience} {...rest} />
);

export { FuiItemName, FuiCoin, FuiEmptyItem, FuiGoldItem, FuiExperienceItem };
