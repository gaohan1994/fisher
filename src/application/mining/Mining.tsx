import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiDashboard, FuiContainer, RecipeCardGrid, MiningRecipeCard } from '@Fui';

const PageMining = observer(() => {
  const { mining } = core;
  const {
    packages: { recipes },
  } = mining;

  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={mining} />
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <RecipeCardGrid key={recipe.id}>
            <MiningRecipeCard recipe={recipe} />
          </RecipeCardGrid>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { PageMining };
