import React from 'react';
import { observer } from 'mobx-react';
import { Button, Divider, Grid, Stack } from '@mui/material';
import { Enemy, Master } from '@FisherCore';
import { FuiFightEmptyEnemyInfo, FuiFightPersonInfo } from './FightPersonInfo';
import { FuiMasterHealPotionHandler, FuiPersonAttributePanel, PersonEquipmentsPanel } from '../person';

const FightPersonStack: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
    {children}
  </Stack>
);

interface IFuiFightManager {
  master: Master;
  onRetreatClick: () => void;
  enemy?: Enemy;
}
const FuiFightManager: React.FC<IFuiFightManager> = observer(({ master, enemy, onRetreatClick }) => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <FuiFightPersonInfo
        player={master}
        action={
          master.person.isAttacking && (
            <Button variant="contained" color="error" onClick={onRetreatClick}>
              逃跑
            </Button>
          )
        }
      >
        <FightPersonStack>
          <FuiMasterHealPotionHandler />
        </FightPersonStack>
        <FightPersonStack>
          <PersonEquipmentsPanel person={master.person} />
          <FuiPersonAttributePanel person={master.person} />
        </FightPersonStack>
      </FuiFightPersonInfo>
    </Grid>
    <Grid item xs={6}>
      {enemy === undefined && <FuiFightEmptyEnemyInfo />}
      {enemy !== undefined && (
        <FuiFightPersonInfo player={enemy}>
          <FightPersonStack>
            <FuiPersonAttributePanel person={master.person} />
          </FightPersonStack>
        </FuiFightPersonInfo>
      )}
    </Grid>
  </Grid>
));

export { FuiFightManager };
