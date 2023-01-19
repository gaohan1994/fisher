import { Container } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const FuiContainer: FC<PropsWithChildren> = ({ children }) => {
  return <Container maxWidth="lg">{children}</Container>;
};

export { FuiContainer };
