import React from 'react';
import { observer } from 'mobx-react';
import { Card, CardContent, CardHeader, Divider, Grid } from '@mui/material';
import { core } from '@FisherCore';
import {
  FuiColor,
  FuiContainer,
  FuiCardTitle,
  FuiPersonAttributePanel,
  PersonEquipmentsPanel,
  FuiMasterHealPotionHandler,
} from '@Fui';
import { PageBackpack } from '../backpack';

const PageMaster: React.FC = observer(() => {
  const { master } = core;

  return (
    <React.Fragment>
      <FuiContainer>
        <Card sx={{ bgcolor: FuiColor.primary.background }}>
          <CardHeader title={<FuiCardTitle value="人物装备" />} sx={{ pb: 0 }} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs>
                <PersonEquipmentsPanel person={master.person} />
              </Grid>
              <Grid item xs>
                <FuiPersonAttributePanel person={master.person} />
              </Grid>
              <Grid item xs>
                <FuiMasterHealPotionHandler />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Divider sx={{ mt: 2, mb: 2 }} />
      </FuiContainer>
      <PageBackpack />
    </React.Fragment>
  );
});

export { PageMaster };
