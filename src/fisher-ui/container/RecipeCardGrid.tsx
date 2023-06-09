import { FC, PropsWithChildren } from 'react';
import { Grid, GridProps } from '@mui/material';

const DefaultRecipeCardGridXS = 3;

interface IRecipeCardGrid extends GridProps {}
const RecipeCardGrid: FC<PropsWithChildren<IRecipeCardGrid>> = ({ children, xs, ...rest }) => (
  <Grid item xs={xs ?? DefaultRecipeCardGridXS} {...rest}>
    {children}
  </Grid>
);

export { RecipeCardGrid };
