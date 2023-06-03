import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiCollectionSkillRecipeCard, FuiContainer, FuiDashboard, FuiRecipeTable } from '@Fui';

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
              <Grid item xs={6} key={item.id}>
                <FuiCollectionSkillRecipeCard recipe={item} coreComponent={forge} />
              </Grid>
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
