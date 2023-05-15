import React from 'react';
import { observer } from 'mobx-react';
import { Card, Tooltip, Grid, Tab, Tabs, Avatar, CardHeader, IconButton } from '@mui/material';
import { Assets, core, EnemyItem } from '@FisherCore';

const BattleEnemySelector: React.FC = observer(() => {
  const { battle } = core;
  const { packages } = battle;
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange}>
        {packages.map((battleArea) => (
          <Tab label={battleArea.name} key={battleArea.id} />
        ))}
      </Tabs>
      {packages.map((battleArea, index) => (
        <TabPanel value={value} index={index} key={`${value}-${index}`}>
          {battleArea.enemies.map((enemy) => (
            <Grid item xs={3} key={enemy.id}>
              <FuiEnmeyItem enemy={enemy} />
            </Grid>
          ))}
        </TabPanel>
      ))}
    </React.Fragment>
  );
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Grid container spacing={2}>
        {children}
      </Grid>
    )}
  </div>
);

interface EnemyItemProps {
  enemy: EnemyItem;
}
const FuiEnmeyItem: React.FC<EnemyItemProps> = observer(({ enemy }) => {
  const { battle } = core;

  const onClickAttack = () => {
    battle.setAcitveEnemyItem(enemy);
    battle.start();
  };

  return (
    <Card>
      <CardHeader
        title={enemy.name}
        avatar={<Avatar src={enemy.media} />}
        action={
          <Tooltip title="战斗">
            <IconButton onClick={onClickAttack}>
              <Avatar src={Assets.attack} variant="square" sx={{ width: 30, height: 30 }} />
            </IconButton>
          </Tooltip>
        }
      />
    </Card>
  );
});

export { BattleEnemySelector };
