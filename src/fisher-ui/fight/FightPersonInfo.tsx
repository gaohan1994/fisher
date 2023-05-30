import React, { FC } from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, Divider, Stack } from '@mui/material';
import { Enemy, Master, Person, PersonModeName } from '@FisherCore';
import { FuiColor } from '@Fui';
import { FuiFightControl } from './FightControl';
import { usePersonModeColor } from './FightHook';
import { FuiLevelInfo } from '../experience';

interface Props {
  player: Master | Enemy;
  action?: React.ReactNode;
}
const FuiFightPersonInfo: React.FC<React.PropsWithChildren<Props>> = ({ player, action, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader
      avatar={<Avatar src={player.media} />}
      title={player.person.isMaster ? (player as Master).displayName : player.name}
      subheader={
        <Stack direction="row" spacing={1}>
          <PersonModeText person={player.person} />
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
);

interface IPersonModeText {
  person: Person;
}
const PersonModeText: FC<IPersonModeText> = ({ person }) => {
  const { color } = usePersonModeColor(person.mode);
  return (
    <Typography sx={{ color }} variant="caption">
      {PersonModeName[person.mode]}
    </Typography>
  );
};

export { FuiFightPersonInfo };
