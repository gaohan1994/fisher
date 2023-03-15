import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer } from '@Fui';
import { BattleEnemySelector } from './BattleEnemySelector';
import { BattleRewards } from './BattleRewards';
import { FuiBattlePersonInfo } from './BattlePersonInfo';

const PageBattle: React.FC = observer(() => {
  const { battle } = core;
  return (
    <FuiContainer>
      <BattleEnemySelector />
      <Divider sx={{ m: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FuiBattlePersonInfo man={battle.master} />
        </Grid>
        <Grid item xs={6}>
          {battle.enemy?.person && <FuiBattlePersonInfo man={battle.enemy} />}
        </Grid>
      </Grid>
      <Divider sx={{ m: 2 }} />
      <BattleRewards />
    </FuiContainer>
  );
});

export { PageBattle };
