import React from 'react';
import { Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { Assets, Enemy, Master, Person, PersonMode } from '@FisherCore';
import { FuiColor } from '@Fui';
import { FuiBattleControl } from './BattleControl';

interface Props {
  man: Master | Enemy;
  action?: React.ReactNode;
}
const FuiBattlePersonInfo: React.FC<React.PropsWithChildren<Props>> = ({ man, action, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader
      avatar={<Avatar src={man.media} />}
      title={man.mode === PersonMode.Master ? (man as Master).displayName : man.name}
      subheader={`等级：1`}
      action={action}
    />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <FuiBattleControl person={man.person} />
      {children}
    </CardContent>
  </Card>
);

const FuiBattleEmptyEnemyInfo: React.FC = () => (
  <Card>
    <CardHeader avatar={<Avatar src={Assets.logo} />} title="?" subheader="等级：?" />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <FuiBattleControl person={new Person(PersonMode.Enemy)} />
    </CardContent>
  </Card>
);

export { FuiBattlePersonInfo, FuiBattleEmptyEnemyInfo };
