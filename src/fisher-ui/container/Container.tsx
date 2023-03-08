import { Container, Typography } from '@mui/material';
import React, { FC, PropsWithChildren } from 'react';

const FuiContainer: FC<PropsWithChildren> = ({ children }) => (
  <Container maxWidth="lg" sx={{ margin: '0 auto', minWidth: 1200 }}>
    {children}
  </Container>
);

interface FuiCardTitleProps {
  value: React.ReactNode;
}
const FuiCardTitle: FC<FuiCardTitleProps> = ({ value }) => (
  <Typography sx={{ fontWeight: 'bold' }} variant="h5">
    {value}
  </Typography>
);

export { FuiContainer, FuiCardTitle };
