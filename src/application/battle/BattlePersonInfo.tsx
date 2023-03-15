import React from 'react';
import { Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { Enemy, Master, PersonMode } from '@FisherCore';
import { FuiBattleControl } from './BattleControl';

interface Props {
  man: Master | Enemy;
}
const FuiBattlePersonInfo: React.FC<React.PropsWithChildren<Props>> = ({
  man,
  children,
}) => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={man.media} />}
        title={
          man.mode === PersonMode.Master
            ? (man as Master).displayName
            : man.name
        }
        subheader={`等级：1`}
      />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <FuiBattleControl person={man.person} />
        {children}
      </CardContent>
    </Card>
  );
};

export { FuiBattlePersonInfo };
