import { FC } from 'react';
import { Grid, List, ListSubheader } from '@mui/material';
import { Item } from '@FisherCore';
import { FuiItemDetailPopover, FuiItemRender } from '../item';

interface IRewardList {
  items: Item[];
  listHeader: React.ReactNode;
  renderKey?: (item: Item) => React.Key;
}
const RewardList: FC<IRewardList> = ({ listHeader, items, renderKey }) => (
  <List>
    <ListSubheader>{listHeader}</ListSubheader>
    <Grid container spacing={0}>
      {items.map((item, index) => (
        <Grid key={renderKey ? renderKey(item) : `${item.id}-${index}`} item>
          <FuiItemRender item={item} showQuantity={false} popover={FuiItemDetailPopover.MouseOver} />
        </Grid>
      ))}
    </Grid>
  </List>
);

export { RewardList };
