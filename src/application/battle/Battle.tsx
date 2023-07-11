import React from 'react';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { FuiDashboard, FuiContainer, FuiFightManager, FuiRewardPool } from '@Fui';
import { useBattle } from '../core';

const PageBattle: React.FC = observer(() => {
  const battle = useBattle();
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={battle} />
      <Divider sx={{ m: 2 }} />
      <FuiFightManager fightComponent={battle} />
      <Divider sx={{ m: 2 }} />
      <FuiRewardPool rewardPool={battle.rewardPool} />
    </FuiContainer>
  );
});

export { PageBattle };
