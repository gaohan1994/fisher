import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { ForgeRecipeCard, FuiContainer, FuiDashboard, FuiRecipeTable, RecipeCardGrid } from '@Fui';

const PageForge: React.FC = observer(() => {
  const { forge } = core;
  const { packages } = forge;
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={forge} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container spacing={2}>
            {packages.map((item) => (
              <RecipeCardGrid xs={6} key={item.id}>
                <ForgeRecipeCard recipe={item} />
              </RecipeCardGrid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FuiRecipeTable coreComponent={forge} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageForge };
