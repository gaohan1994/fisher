import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiCollectionSkillRecipeCard, FuiDashboard, FuiRecipeTable } from '@Fui';

const PageCook = observer(() => {
  const { cook } = core;
  const { packages } = cook;
  return (
    <FuiContainer>
      <FuiDashboard collection={cook} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container spacing={2}>
            {packages.map((item) => (
              <Grid item xs={6} key={item.id}>
                <FuiCollectionSkillRecipeCard recipe={item} coreComponent={cook} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FuiRecipeTable coreComponent={cook} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageCook };
