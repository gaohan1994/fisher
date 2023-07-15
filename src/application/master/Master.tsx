import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, Card, CardContent, CardHeader, Divider, Grid, Stack } from '@mui/material';
import { core } from '@FisherCore';
import {
  FuiColor,
  FuiContainer,
  FuiCardTitle,
  FuiPersonAttributePanel,
  PersonEquipmentsPanel,
  FuiMasterHealPotionHandler,
  FuiExperienceDetail,
  FuiLevelChip,
} from '@Fui';
import { PageBackpack } from '../backpack';

const PageMaster: React.FC = observer(() => {
  const { master } = core;

  return (
    <React.Fragment>
      <FuiContainer>
        <Card sx={{ bgcolor: FuiColor.primary.background }}>
          <CardHeader
            avatar={<Avatar src={master.media} />}
            title={
              <Stack direction="row">
                <FuiCardTitle value="等级" />
                <FuiLevelChip experience={master.person.experience} sx={{ ml: 2 }} />
              </Stack>
            }
          />
          <CardContent>
            <FuiExperienceDetail experience={master.person.experience} />
          </CardContent>
        </Card>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Card sx={{ bgcolor: FuiColor.primary.background }}>
          <CardHeader title={<FuiCardTitle value="装备" />} sx={{ pb: 0 }} />
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
