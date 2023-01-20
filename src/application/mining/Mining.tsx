import { observer } from 'mobx-react';
import { Container, Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiMiningRecipe } from './Recipe';
import { FuiDashboard } from './Dashboard';

const FuiMining = observer(() => {
  const { mining } = core;
  const {
    packages: { recipes },
  } = mining;

  return (
    <Container maxWidth="lg" sx={{ margin: '0 auto' }}>
      <FuiDashboard />
      <Grid container spacing={2}>
        {recipes.map((item) => (
          <Grid key={item.id} item xs={3}>
            <FuiMiningRecipe recipe={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
});

export { FuiMining };
