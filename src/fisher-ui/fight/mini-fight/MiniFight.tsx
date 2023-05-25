import { useState } from 'react';
import { observer } from 'mobx-react';
import Draggable from 'react-draggable';
import { Assets, core } from '@FisherCore';
import { ButtonGroup, Divider, Paper, Stack } from '@mui/material';
import { MiniFightStore } from './MiniFightStore';
import { FuiMiniFightPerson } from './MiniFightPerson';
import { FuiMiniExecuteRewardButton, FuiMiniMasterHealPotionButton, FuiMiniRetreatButton } from './MiniFightActions';

const FuiMiniFight = observer(() => {
  const [miniFightStore] = useState(() => new MiniFightStore());

  if (!miniFightStore.miniFightVisible) {
    return null;
  }

  const fight = miniFightStore.activeFightComponent!.fight;

  const onRetreat = () => {
    miniFightStore.stopActiveFightComponent();
    core.componentManager.clearActiveComponent();
  };

  const onExecuteRewards = () => {
    miniFightStore.executeActiveFightComponentRewards();
  };

  return (
    <Draggable>
      <Paper sx={{ zIndex: 9999, position: 'fixed', bottom: 20, right: 40 }}>
        <Stack direction="row" divider={<Divider />}>
          <FuiMiniFightPerson avatar={Assets.logo} person={fight.info.master.person} />
          {fight.info.enemy?.person && <FuiMiniFightPerson avatar={Assets.logo} person={fight.info.enemy.person} />}
        </Stack>
        <Divider />
        <ButtonGroup>
          <FuiMiniMasterHealPotionButton />
          <FuiMiniExecuteRewardButton onClick={onExecuteRewards} />
          <FuiMiniRetreatButton onClick={onRetreat} />
        </ButtonGroup>
      </Paper>
    </Draggable>
  );
});

export { FuiMiniFight };
