import React from 'react';
import { observer } from 'mobx-react';
import { Button, Divider, Grid, Stack } from '@mui/material';
import { Battle, Dungeon, core } from '@FisherCore';
import { FuiFightPersonInfo } from './FightPersonInfo';
import { FuiMasterHealPotionHandler, FuiPersonAttributePanel, PersonEquipmentsPanel } from '../person';
import { useCurrentComponentActive, useFightComponentActions } from './FightHook';
import { FuiFightEmptyEnemyInfo, FuiFightEmptyMasterInfo } from './EmptyPerson';
import { FuiFightRecords } from './FightRecords';

const FightPersonStack: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
    {children}
  </Stack>
);

interface IFuiFightManager {
  fightComponent: Battle | Dungeon;
}
const FuiFightManager: React.FC<IFuiFightManager> = observer(({ fightComponent }) => {
  const isCurrentFightComponentActive = useCurrentComponentActive(fightComponent);
  const { stopFightComponent } = useFightComponentActions(fightComponent);

  const retreatButton = (
    <Button variant="contained" color="error" onClick={stopFightComponent}>
      逃跑
    </Button>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {!isCurrentFightComponentActive && <FuiFightEmptyMasterInfo />}
        {isCurrentFightComponentActive && (
          <FuiFightPersonInfo player={core.master} action={core.master.person.isAttacking && retreatButton}>
            <FuiPersonAttributePanel person={core.master.person} />
            <FightPersonStack>
              <PersonEquipmentsPanel person={core.master.person} />
              <FuiMasterHealPotionHandler />
            </FightPersonStack>
          </FuiFightPersonInfo>
        )}
      </Grid>
      <Grid item xs={6}>
        {!fightComponent.enemy && <FuiFightEmptyEnemyInfo />}
        {fightComponent.enemy && (
          <FuiFightPersonInfo player={fightComponent.enemy}>
            <FuiPersonAttributePanel person={fightComponent.enemy.person} />
            {fightComponent.fight && <FuiFightRecords fight={fightComponent.fight} />}
          </FuiFightPersonInfo>
        )}
      </Grid>
    </Grid>
  );
});

export { FuiFightManager };
