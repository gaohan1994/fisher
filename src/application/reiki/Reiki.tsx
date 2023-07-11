import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiContainer, FuiDashboard, RecipeCardGrid, ReikiRecipeCard } from '@Fui';
import { useReiki } from '../core';

const PageReiki = observer(() => {
  const reiki = useReiki();
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
