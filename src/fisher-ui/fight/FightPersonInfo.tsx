import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Stack, List } from '@mui/material';
import { Enemy, Master } from '@FisherCore';
import { FuiColor, PersonModeText } from '@Fui';
import { FightListItem, FuiFightControl } from './FightControl';
import { FuiLevelInfo } from '../experience';
import { observer } from 'mobx-react';
import { FuiFightActions } from './FightActions';

interface Props {
  player: Master | Enemy;
  action?: React.ReactNode;
}
const FuiFightPersonInfo: React.FC<React.PropsWithChildren<Props>> = observer(({ player, action, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader
      avatar={<Avatar src={player.media} />}
      title={player.person.isMaster ? (player as Master).displayName : player.name}
      subheader={
        <Stack direction="row" spacing={1}>
          <PersonModeText mode={player.person.mode} />
          <FuiLevelInfo level={player.person.experience.level} />
        </Stack>
      }
      action={action}
    />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <List>
        <FuiFightControl person={player.person} />
        <FightListItem title="状态栏">
          <FuiFightActions
            actions={[
              ...player.person.actionManager.activeDotActions,
              ...player.person.actionManager.activeBuffActions,
              ...player.person.actionManager.activeDebuffActions,
            ]}
          />
        </FightListItem>
      </List>
      {children}
    </CardContent>
  </Card>
));

export { FuiFightPersonInfo };
