import { FC } from 'react';
import { observer } from 'mobx-react';
import { CostControlMap, IRecipeItem, Item } from '@FisherCore';
import { List, ListItemAvatar, ListItemText } from '@mui/material';

import { FuiItemName, ItemPopoverVariant } from '../../item';
import { renderItem } from '../../render';
import { RewardCostText, RewardListItem, StationSubHeader } from './Styled';

const CostsHeader = '所需材料';
const CostItemPrefix = '数量：';

interface CostsProps {
  control: CostControlMap;
  items: Array<readonly [IRecipeItem, Item]>;
}
export const Costs: FC<CostsProps> = observer(({ control, items }) => (
  <List id="cost-items-list" subheader={<StationSubHeader>{CostsHeader}</StationSubHeader>}>
    {items.map(([recipeItem, item], index) => {
      const { canBearCost, backpackItem } = control.get(item.id)!;
      return (
        <RewardListItem key={`cost-${item.id}-${index}`}>
          <ListItemAvatar id="item-avatar">
            {renderItem({ item, variant: ItemPopoverVariant.MouseOver })}
          </ListItemAvatar>
          <ListItemText
            primary={<FuiItemName item={item} />}
            secondary={
              <RewardCostText requirement={canBearCost}>
                {CostItemPrefix}
                {`${backpackItem?.quantity ?? 0} / ${recipeItem.itemQuantity}`}
              </RewardCostText>
            }
          />
        </RewardListItem>
      );
    })}
  </List>
));
