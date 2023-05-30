import { FC, ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { useLevelColor } from './LevelHook';

interface IFuiLevelInfo extends TypographyProps {
  level: number;
  prefixNode?: ReactNode;
}
const FuiLevelInfo: FC<IFuiLevelInfo> = ({ prefixNode = 'Lv:', level, ...rest }) => {
  const { color } = useLevelColor(level);
  const sx = {
    ...(rest.sx ?? {}),
    color,
  };
  return (
    <Typography {...rest} sx={sx} variant="caption">
      {prefixNode}
      {level}
    </Typography>
  );
};

export { FuiLevelInfo };
