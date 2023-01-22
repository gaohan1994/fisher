import { Container } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const FuiContainer: FC<PropsWithChildren> = ({ children }) => (
  <Container maxWidth="lg" sx={{ margin: '0 auto' }}>
    {children}
  </Container>
);

export { FuiContainer };
