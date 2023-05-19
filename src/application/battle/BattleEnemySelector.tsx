import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Tab, Tabs } from '@mui/material';
import { core } from '@FisherCore';
import { BattleEnemyCard } from './BattleEnemyCard';

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
          {battleArea.enemies.map((enemyItem) => (
            <Grid item xs={4} key={enemyItem.id}>
              <BattleEnemyCard enemyItem={enemyItem} />
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

export { BattleEnemySelector };
