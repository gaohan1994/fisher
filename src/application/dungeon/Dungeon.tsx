import { FC } from 'react';
import { FuiDashboard, FuiContainer, FuiRewardPool } from '@Fui';
import { observer } from 'mobx-react';
import { Divider } from '@mui/material';
import { FuiFightManager } from '@Fui';
import { useDungeon } from '../core';

const PageDungeon: FC = observer(() => {
  const dungeon = useDungeon();
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={dungeon} />
      <Divider sx={{ m: 2 }} />
      <FuiFightManager fightComponent={dungeon} />
      <Divider sx={{ m: 2 }} />
      <FuiRewardPool rewardPool={dungeon.rewardPool} />
    </FuiContainer>
  );
});

export { PageDungeon };
