import React from 'react';
import { Card, CardHeader, CardContent, Avatar, Stack } from '@mui/material';
import { Enemy, Master } from '@FisherCore';
import { FuiColor, PersonModeText } from '@Fui';
import { FuiFightControl } from './FightControl';
import { FuiLevelInfo } from '../experience';
import { observer } from 'mobx-react';

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
      <FuiFightControl person={player.person} />
      {children}
    </CardContent>
  </Card>
));

export { FuiFightPersonInfo };
