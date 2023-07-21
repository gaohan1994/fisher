import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiDashboard, FuiContainer } from '@Fui';

import { GridRecipe, RecipeCard } from '../components';
import { useMining } from '../core';
import { useRecipes } from './Hook';

const PageMining = observer(() => {
  const mining = useMining();
  const recipes = useRecipes();
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={mining} />
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <GridRecipe key={recipe.id}>
            <RecipeCard component={mining} recipe={recipe} />
          </GridRecipe>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { PageMining };
