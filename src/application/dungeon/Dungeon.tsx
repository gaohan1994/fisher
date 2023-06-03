import { FuiDashboard, FuiContainer, FuiRewardPool } from '@Fui';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { core } from '@FisherCore';
import { FuiFightManager } from '@Fui';

const PageDungeon = observer(() => (
  <FuiContainer>
    <FuiDashboard fisherComponent={core.dungeon} />
    <Divider sx={{ m: 2 }} />
    <FuiFightManager fightComponent={core.dungeon} />
    <Divider sx={{ m: 2 }} />
    <FuiRewardPool rewardPool={core.dungeon.rewardPool} />
  </FuiContainer>
));

export { PageDungeon };
