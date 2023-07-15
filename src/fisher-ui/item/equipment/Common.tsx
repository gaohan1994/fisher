import { FC, PropsWithChildren } from 'react';
import { Typography, TypographyProps } from '@mui/material';

export const EquipmentText: FC<PropsWithChildren<TypographyProps>> = ({ children, ...rest }) => (
  <Typography variant="caption" component="div" {...(rest as any)}>
    {children}
  </Typography>
);
