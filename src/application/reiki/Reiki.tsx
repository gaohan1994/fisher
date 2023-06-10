import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard, RecipeCardGrid, ReikiRecipeCard } from '@Fui';

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
            <ReikiRecipeCard recipe={recipe} />
          </RecipeCardGrid>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { PageReiki };
