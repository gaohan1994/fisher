import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard } from '@Fui';
import { FuiMiningRecipe } from './Recipe';

const PageMining = observer(() => {
  const { mining } = core;
  const {
    packages: { recipes },
  } = mining;

  return (
    <FuiContainer>
      <FuiDashboard collection={mining} />
      <Grid container spacing={2}>
        {recipes.map((item) => (
          <Grid key={item.id} item xs={3}>
            <FuiMiningRecipe recipe={item} />
          </Grid>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { PageMining };
