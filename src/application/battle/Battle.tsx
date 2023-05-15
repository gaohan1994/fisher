import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Grid, Stack } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiMasterHealPotionHandler, FuiPersonAttributePanel, PersonEquipmentsPanel } from '@Fui';
import { BattleEnemySelector } from './BattleEnemySelector';
import { BattleRewards } from './BattleRewards';
import { FuiBattleEmptyEnemyInfo, FuiBattlePersonInfo } from './BattlePersonInfo';
import { FuiBattleStopButton } from './BattleActions';

const BattlePersonStack: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
    {children}
  </Stack>
);

const PageBattle: React.FC = observer(() => {
  const { battle } = core;
  return (
    <FuiContainer>
      <BattleEnemySelector />
      <Divider sx={{ m: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FuiBattlePersonInfo man={battle.master} action={battle.isAttacking && <FuiBattleStopButton />}>
            <BattlePersonStack>
              <FuiMasterHealPotionHandler />
            </BattlePersonStack>
            <BattlePersonStack>
              <PersonEquipmentsPanel person={battle.master.person} />
              <FuiPersonAttributePanel person={battle.master.person} />
            </BattlePersonStack>
          </FuiBattlePersonInfo>
        </Grid>
        <Grid item xs={6}>
          {battle.enemy === undefined ? (
            <FuiBattleEmptyEnemyInfo />
          ) : (
            <FuiBattlePersonInfo man={battle.enemy}>
              <BattlePersonStack>
                <FuiPersonAttributePanel person={battle.master.person} />
              </BattlePersonStack>
            </FuiBattlePersonInfo>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ m: 2 }} />
      <BattleRewards />
    </FuiContainer>
  );
});

export { PageBattle };
