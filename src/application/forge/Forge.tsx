import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard } from '@Fui';
import { FuiForgeRecipe } from './Recipe';
import { FuiForgeTable } from './ForgeTable';

const PageForge = observer(() => {
  const { forge } = core;
  const { packages } = forge;

  return (
    <FuiContainer>
      <FuiDashboard collection={forge} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container spacing={2}>
            {packages.map((item) => (
              <Grid item xs={6}>
                <FuiForgeRecipe recipe={item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FuiForgeTable />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageForge };
