import { FC, ReactNode } from 'react';
import { IRecipeItem, Item } from '@FisherCore';
import { List, ListItemAvatar, ListItemText } from '@mui/material';

import { renderItem } from '../../render';
import { FuiItemName, ItemPopoverVariant } from '../../item';
import { RewardListItem, RewardText, StationSubHeader } from './Styled';

const RewardTextPrefix = '数量：';

interface RewardsProps {
  id: string;
  header: ReactNode;
  items: Array<readonly [IRecipeItem, Item]>;
}
export const Rewards: FC<RewardsProps> = ({ id, header, items }) => (
  <List id={id} subheader={<StationSubHeader>{header}</StationSubHeader>}>
    {items.map(([recipeItem, item], index) => (
      <RewardListItem key={`${id}-${item.id}-${index}`}>
        <ListItemAvatar id="item-avatar">{renderItem({ item, variant: ItemPopoverVariant.MouseOver })}</ListItemAvatar>
        <ListItemText
          primary={<FuiItemName item={item} />}
          secondary={
            <RewardText>
              {RewardTextPrefix}
              {recipeItem.itemQuantity}
            </RewardText>
          }
        />
      </RewardListItem>
    ))}
  </List>
);
