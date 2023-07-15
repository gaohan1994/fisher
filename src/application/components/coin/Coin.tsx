import { FC } from 'react';
import { coinItem } from '@FisherCore';
import { Stack, Typography } from '@mui/material';

import { useCoinValue } from './Hook';
import { FuiColor } from '../theme';
import { CoinMedia } from './Styled';

interface FuiCoinProps {
  coin: number;
}
export const FuiCoin: FC<FuiCoinProps> = ({ coin }) => {
  const value = useCoinValue(coin);
  return (
    <Stack direction="row" spacing={1}>
      <CoinMedia src={coinItem.media} />
      <Typography color={FuiColor.gold}>{value}</Typography>
    </Stack>
  );
};
