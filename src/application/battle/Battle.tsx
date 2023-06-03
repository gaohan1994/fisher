import React from 'react';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { core } from '@FisherCore';
import { FuiDashboard, FuiContainer, FuiFightManager, FuiRewardPool } from '@Fui';

const PageBattle: React.FC = observer(() => (
  <FuiContainer>
    <FuiDashboard fisherComponent={core.battle} />
    <Divider sx={{ m: 2 }} />
    <FuiFightManager fightComponent={core.battle} />
    <Divider sx={{ m: 2 }} />
    <FuiRewardPool rewardPool={core.battle.rewardPool} />
  </FuiContainer>
));

export { PageBattle };
