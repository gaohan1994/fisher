import { FC } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { DungeonCard } from './DungeonCard';

interface IDungeonSelector {
  onSelectDungeonItem: () => void;
}
const DungeonSelector: FC<IDungeonSelector> = observer(({ onSelectDungeonItem }) => {
  const { dungeon } = core;
  return (
    <Grid container spacing={2}>
      {dungeon.packages.map((item) => (
        <Grid key={item.id} item xs={4}>
          <DungeonCard dungeonItem={item} onSelectDungeonItem={onSelectDungeonItem} />
        </Grid>
      ))}
    </Grid>
  );
});

export { DungeonSelector };
