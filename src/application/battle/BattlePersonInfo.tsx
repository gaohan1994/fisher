import React from 'react';
import { observer } from 'mobx-react';
import { Card, CardHeader, CardContent, Divider, Box, Avatar, Stack, Typography } from '@mui/material';
import { Enemy, Master, PersonMode } from '@FisherCore';
import { FuiDotAction, FuiLineProgress } from '@Fui';
import { FuiBattleControl } from './BattleControl';

interface Props {
  man: Master | Enemy;
}
const FuiBattlePersonInfo: React.FC<Props> = ({ man }) => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={man.media} />}
        title={man.mode === PersonMode.Master ? (man as Master).displayName : man.name}
        subheader={`等级：1`}
      />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <FuiBattleControl person={man.person} />
      </CardContent>
    </Card>
  );
};

export { FuiBattlePersonInfo };
