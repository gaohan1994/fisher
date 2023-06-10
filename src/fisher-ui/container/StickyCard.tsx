import { FC } from 'react';
import { Card, CardProps } from '@mui/material';

const ApplicationHeaderHeight = 64;
const ApplicationHeaderSpace = 20;

const FuiStickyCard: FC<CardProps> = ({ children, sx, ...rest }) => (
  <Card sx={{ ...sx, position: 'sticky', top: ApplicationHeaderHeight + ApplicationHeaderSpace }} {...rest}>
    {children}
  </Card>
);

export { FuiStickyCard };
