import React from 'react';
import { Card, CardHeader, CardContent, Avatar, List } from '@mui/material';
import { Assets, core } from '@FisherCore';
import { FuiLineProgress } from '@Fui';
import { FightListItem } from './FightControl';
import { FuiFightActions } from './FightActions';

const EmptyPersonFightListItems: React.FC = () => (
  <React.Fragment>
    <FightListItem title="生命值">
      <FuiLineProgress value={100} color="progressHp" />
    </FightListItem>
    <FightListItem title="攻速">
      <FuiLineProgress value={100} color="progress" />
    </FightListItem>
  </React.Fragment>
);

const EmptyActions: React.FC = () => (
  <FightListItem title="状态栏">
    <FuiFightActions actions={[]} />
  </FightListItem>
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
        <List>
          <EmptyPersonFightListItems />
          <EmptyActions />
        </List>
      </CardContent>
    </Card>
  );
};

const FuiFightEmptyEnemyInfo: React.FC = () => (
  <Card>
    <CardHeader avatar={<Avatar src={Assets.logo} />} title="?" subheader="等级：?" />
    <CardContent sx={{ pt: 0, pb: 0 }}>
      <List>
        <EmptyPersonFightListItems />
        <EmptyActions />
      </List>
    </CardContent>
  </Card>
);

export { FuiFightEmptyMasterInfo, FuiFightEmptyEnemyInfo };
