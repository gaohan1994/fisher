import { observer } from 'mobx-react';
import { Stack, Typography } from '@mui/material';
import { FuiBackpackBatchSellAction, FuiItemRender } from '@Fui';
import { useBackpack } from '../core';
import { backpackStore } from './BackpackStore';
import { BackpackTabContainer } from './Styled';

export const BackpackFullItemsTab = () => (
  <BackpackTabContainer>
    <FuiBackpackBatchSellAction />
    <BackpackFullItems />
  </BackpackTabContainer>
);

const BackpackFullItems = observer(() => {
  const backpack = useBackpack();
  const { activeBackpackItem, setActiveBackpackItem } = backpackStore;

  if (backpack.items.size === 0) {
    return <Typography variant="caption">暂无物品</Typography>;
  }

  return (
    <Stack direction="row">
      {backpack.backpackItems.map((backpackItem) => (
        <FuiItemRender
          key={`${backpackItem.item.id}-${backpackItem.quantity}`}
          item={backpackItem.item}
          showBorder={activeBackpackItem?.item.id === backpackItem.item.id}
          onClick={() => setActiveBackpackItem(backpackItem)}
        />
      ))}
    </Stack>
  );
});
