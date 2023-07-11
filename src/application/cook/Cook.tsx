import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiContainer, FuiDashboard, FuiRecipeTable, RecipeCardGrid, CookRecipeCard } from '@Fui';
import { useCook } from '../core';

const PageCook = observer(() => {
  const cook = useCook();
  const { packages } = cook;
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={cook} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container spacing={2}>
            {packages.map((item) => (
              <RecipeCardGrid xs={6} key={item.id}>
                <CookRecipeCard recipe={item} />
              </RecipeCardGrid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FuiRecipeTable coreComponent={cook} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageCook };
