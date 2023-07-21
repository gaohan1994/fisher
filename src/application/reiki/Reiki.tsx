import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiContainer, FuiDashboard } from '@Fui';

import { useReiki } from '../core';
import { GridRecipe, RecipeCard } from '../components';
import { useRecipes } from './Hook';

const PageReiki = observer(() => {
  const reiki = useReiki();
  const recipes = useRecipes();
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={reiki} />
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <GridRecipe key={recipe.id}>
            <RecipeCard component={reiki} recipe={recipe} />
          </GridRecipe>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { PageReiki };
