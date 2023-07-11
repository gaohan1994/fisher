import { Grid, GridProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

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
