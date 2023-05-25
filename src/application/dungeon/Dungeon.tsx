import { FuiContainer, FuiRewardPool } from '@Fui';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { core } from '@FisherCore';
import { FuiFightManager } from '@Fui';
import { DungeonDashboard } from './DungeonDashboard';

const PageDungeon = observer(() => {
  const { dungeon } = core;
  return (
    <FuiContainer>
      <DungeonDashboard />
      <Divider sx={{ m: 2 }} />
      <FuiFightManager fightComponent={dungeon} />
      <Divider sx={{ m: 2 }} />
      <FuiRewardPool rewardPool={dungeon.rewardPool} />
    </FuiContainer>
  );
});

export { PageDungeon };
