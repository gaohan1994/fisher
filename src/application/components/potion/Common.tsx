import { FC } from 'react';
import { Typography } from '@mui/material';
import { Potion } from '@FisherCore';

import { FuiColor } from '../theme';

const UsePotionTip = '攻击时服用丹药会重置攻击进度条';
const EmptyPotionDesc = '暂无描述';

export const PotionTip: FC = () => (
  <Typography variant="caption" color={FuiColor.red}>
    {UsePotionTip}
  </Typography>
);

interface PotionDescProps {
  potion: Potion | undefined;
}
export const PotionDesc: FC<PotionDescProps> = ({ potion }) => (
  <Typography variant="caption" color={FuiColor.primaryGreen}>
    {potion?.desc ?? EmptyPotionDesc}
  </Typography>
);
