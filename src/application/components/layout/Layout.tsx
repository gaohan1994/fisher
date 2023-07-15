import { FC, PropsWithChildren } from 'react';
import { Container, ContainerProps, Grid, GridProps, styled } from '@mui/material';

const MinContainerWidth = 1200;
export const FuiContainer = styled(({ ...rest }: ContainerProps) => <Container maxWidth="lg" {...rest} />)(() => ({
  margin: '0 auto',
  minWidth: MinContainerWidth,
}));

interface IGridContainer extends GridProps {}
export const GridContainer: FC<PropsWithChildren<IGridContainer>> = ({ children, ...rest }) => (
  <Grid container spacing={2} {...rest}>
    {children}
  </Grid>
);

export const GridLeft: FC<PropsWithChildren<IGridContainer>> = ({ children, ...rest }) => (
  <Grid item xs={9} {...rest}>
    {children}
  </Grid>
);

export const GridRight: FC<PropsWithChildren<IGridContainer>> = ({ children, ...rest }) => (
  <Grid item xs={3} {...rest}>
    {children}
  </Grid>
);
