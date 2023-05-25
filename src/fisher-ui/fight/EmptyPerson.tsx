import React from 'react';
import { Card, CardHeader, CardContent, Avatar } from '@mui/material';
import { Assets, core } from '@FisherCore';
import { FuiLineProgress } from '@Fui';
import { FightListItem } from './FightControl';

const EmptyPersonFightListItems: React.FC = () => (
  <React.Fragment>
    <FightListItem title="生命值" primary={<FuiLineProgress value={100} color="progressHp" />} />
    <FightListItem title="攻速" primary={<FuiLineProgress value={100} color="progress" />} />
  </React.Fragment>
);

const FuiFightEmptyMasterInfo: React.FC = () => {
  const { master } = core;
  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={Assets.logo} />}
        title={master.displayName}
        subheader={`等级：${master.level}`}
      />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        <EmptyPersonFightListItems />
      </CardContent>
    </Card>
  );
};

const FuiFightEmptyEnemyInfo: React.FC = () => (
  <Card>
    <CardHeader avatar={<Avatar src={Assets.logo} />} title="?" subheader="等级：?" />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <EmptyPersonFightListItems />
    </CardContent>
  </Card>
);

export { FuiFightEmptyMasterInfo, FuiFightEmptyEnemyInfo };
