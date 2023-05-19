import React from 'react';
import { Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { Assets, Enemy, Master, Person, PersonMode } from '@FisherCore';
import { FuiColor } from '@Fui';
import { FuiFightControl } from './FightControl';

interface Props {
  player: Master | Enemy;
  action?: React.ReactNode;
}
const FuiFightPersonInfo: React.FC<React.PropsWithChildren<Props>> = ({ player, action, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader
      avatar={<Avatar src={player.media} />}
      title={player.mode === PersonMode.Master ? (player as Master).displayName : player.name}
      subheader={`等级：1`}
      action={action}
    />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <FuiFightControl person={player.person} />
      {children}
    </CardContent>
  </Card>
);

const FuiFightEmptyEnemyInfo: React.FC = () => (
  <Card>
    <CardHeader avatar={<Avatar src={Assets.logo} />} title="?" subheader="等级：?" />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <FuiFightControl person={new Person(PersonMode.Enemy)} />
    </CardContent>
  </Card>
);

export { FuiFightPersonInfo, FuiFightEmptyEnemyInfo };
