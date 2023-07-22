import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiContainer, FuiDashboard } from '@Fui';
import { useCook } from '../core';
import { CookPreview, Station } from '../components';

const PageCook = observer(() => {
  const cook = useCook();
  const { packages } = cook;
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={cook} />
      <Grid container spacing={2}>
        <Grid item xs>
          <Grid container spacing={2}>
            {packages.map((item) => (
              <Grid item xs={6} key={item.id}>
                <CookPreview recipe={item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Station component={cook} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageCook };
