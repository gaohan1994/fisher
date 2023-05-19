import { FuiContainer, FuiRewardPool } from '@Fui';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { DungeonDashboard } from './DungeonDashboard';
import { FuiFightManager } from '../../fisher-ui/fight';
import { core } from '@FisherCore';

const PageDungeon = observer(() => {
  const { dungeon } = core;
  return (
    <FuiContainer>
      <DungeonDashboard />
      <Divider sx={{ m: 2 }} />
      <FuiFightManager master={dungeon.master} enemy={dungeon.enemy} onRetreatClick={dungeon.stop} />
      <Divider sx={{ m: 2 }} />
      <FuiRewardPool rewardPool={dungeon.rewardPool} />
    </FuiContainer>
  );
});

export { PageDungeon };
