import { FC } from 'react';
import { Grid, List, ListSubheader } from '@mui/material';
import { Item } from '@FisherCore';
import { FuiItem } from '../item';

interface IRewardList {
  listHeader: React.ReactNode;
  items: Item[];
}
const RewardList: FC<IRewardList> = ({ listHeader, items }) => (
  <List>
    <ListSubheader>{listHeader}</ListSubheader>
    <Grid container spacing={0}>
      {items.map((item, index) => (
        <Grid key={`${item.id}-${index}`} item>
          <FuiItem item={item} />
        </Grid>
      ))}
    </Grid>
  </List>
);

export { RewardList };
