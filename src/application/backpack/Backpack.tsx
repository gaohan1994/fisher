import { observer } from 'mobx-react';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import { FuiColor, FuiContainer, FuiCoin, FuiCardTitle } from '@Fui';

import { useBank } from '../core';
import { GridContainer, GridLeft, GridRight } from '../components';

import { BackpackTabs } from './BackpackTabs';
import { FuiBackpackItemControl } from './BackpackItemControl';

export const PageBackpack = observer(() => {
  const bank = useBank();

  const backpackHeader = (
    <CardHeader
      title={
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FuiCardTitle value="背包" />
          <FuiCoin price={bank.gold} />
        </Stack>
      }
    />
  );

  return (
    <FuiContainer>
      <GridContainer>
        <GridLeft>
          <Card sx={{ bgcolor: FuiColor.primary.background }}>
            {backpackHeader}
            <CardContent>
              <BackpackTabs />
            </CardContent>
          </Card>
        </GridLeft>
        <GridRight>
          <FuiBackpackItemControl />
        </GridRight>
      </GridContainer>
    </FuiContainer>
  );
});
