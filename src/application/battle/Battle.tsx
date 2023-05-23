import React from 'react';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiFightManager, FuiRewardPool } from '@Fui';
import { BattleDashboard } from './BattleDashboard';

const PageBattle: React.FC = observer(() => {
  const { battle } = core;
  return (
    <FuiContainer>
      <BattleDashboard />
      <Divider sx={{ m: 2 }} />
      <FuiFightManager master={battle.master} enemy={battle.enemy} onRetreatClick={battle.stop} />
      <Divider sx={{ m: 2 }} />
      <FuiRewardPool rewardPool={battle.rewardPool} />
    </FuiContainer>
  );
});

export { PageBattle };
