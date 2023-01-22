import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard } from '@Fui';
import { FuiReikiRecipe } from './Recipe';

const FuiReiki = observer(() => {
  const { reiki } = core;
  const {
    packages: { recipes },
  } = reiki;

  return (
    <FuiContainer>
      <FuiDashboard collection={reiki} />
      <Grid container spacing={2}>
        {recipes.map((item) => (
          <Grid key={item.id} item xs={3}>
            <FuiReikiRecipe recipe={item} />
          </Grid>
        ))}
      </Grid>
    </FuiContainer>
  );
});

export { FuiReiki };
