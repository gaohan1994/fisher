import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Box, Stack, Typography } from '@mui/material';
import { FuiBackpackBatchSellAction, FuiItemRender } from '@Fui';
import { useBackpack } from '../core';
import { backpackStore } from './BackpackStore';

export const BackpackFullItemsTab = () => (
  <Fragment>
    <Box sx={{ mt: 2, mb: 2 }}>
      <FuiBackpackBatchSellAction />
    </Box>
    <BackpackFullItems />
  </Fragment>
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
