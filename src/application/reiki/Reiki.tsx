import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard, MiningRecipeCard, RecipeCardGrid } from '@Fui';

const PageReiki = observer(() => {
  const { reiki } = core;
  const {
    packages: { recipes },
  } = reiki;

  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={reiki} />
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

export { PageReiki };
