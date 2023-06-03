import { CircularProgress, Typography, TypographyProps } from '@mui/material';
import React, { FC } from 'react';
import { FuiColor } from '../theme';

interface IFuiActiveText extends TypographyProps {
  circleProgress?: boolean;
  text: React.ReactNode;
}
const FuiActiveText: FC<IFuiActiveText> = ({ text, circleProgress = true, ...rest }) => (
  <Typography variant="caption" color="secondary" {...rest}>
    {text}
    {circleProgress && <CircularProgress sx={{ ml: 1 }} size={10} color="secondary" />}
  </Typography>
);

interface IFuiActiveControlText {
  text: React.ReactNode;
}
const FuiActiveDashboardText: FC<IFuiActiveControlText> = ({ text }) => (
  <Typography variant="caption" color={FuiColor.progress} component="div" textAlign="center" sx={{ mb: 1 }}>
    {text}
  </Typography>
);

export { FuiActiveText, FuiActiveDashboardText };
