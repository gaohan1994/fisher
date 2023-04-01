import React from 'react';
import { observer } from 'mobx-react';
import { Card, CardContent, CardHeader, Stack, Divider } from '@mui/material';
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
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
              <PersonEquipmentsPanel person={master.person} />
              <Stack>
                <FuiMasterHealPotionHandler />
              </Stack>
              <FuiPersonAttributePanel person={master.person} />
            </Stack>
          </CardContent>
        </Card>
        <Divider sx={{ mt: 2, mb: 2 }} />
      </FuiContainer>
      <PageBackpack />
    </React.Fragment>
  );
});

export { PageMaster };
