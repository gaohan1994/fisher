import React from 'react';
import { Grid, Divider, Typography, Card, CardContent, CardHeader } from '@mui/material';
import { BackpackItem, core, isEquipmentItem, isRewardChest, RewardChest } from '@FisherCore';
import {
  FuiBackpackItemSellAction,
  FuiColor,
  FuiBackpackItemDetailRender,
  UseEquipmentButton,
  FuiOpenRewardChestAction,
} from '@Fui';
import { backpackStore } from './BackpackStore';
import { observer } from 'mobx-react';

const FuiBackpackItemControl = observer(() => {
  const { activeBackpackItem } = backpackStore;
  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardHeader
        title={
          <Typography sx={{ fontWeight: 'bold' }} variant="h5">
            物品操作台
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography>选中物品：{activeBackpackItem === undefined ? '无' : activeBackpackItem.item.name}</Typography>
        <Typography>物品数量：{activeBackpackItem === undefined ? '0' : activeBackpackItem.quantity}</Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />
        {activeBackpackItem !== undefined && <FuiBackpackItemDetailRender backpackItem={activeBackpackItem} />}
        {activeBackpackItem === undefined && <Typography>空</Typography>}
        <Divider sx={{ mt: 2, mb: 2 }} />
        {activeBackpackItem !== undefined && <FuiBackpackItemActions />}
      </CardContent>
    </Card>
  );
});

const FuiBackpackItemActions = observer(() => {
  const { backpack } = core;
  const { activeBackpackItem, clearActiveBackpackItem } = backpackStore;

  const onBackpackItemActionCallback = React.useCallback(() => {
    if (!backpack.checkItem(activeBackpackItem!.item)) {
      clearActiveBackpackItem();
    }
  }, [activeBackpackItem]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FuiBackpackItemSellAction backpackItem={activeBackpackItem!} actionCallback={onBackpackItemActionCallback} />
      </Grid>
      {isEquipmentItem(activeBackpackItem!.item) && (
        <Grid item xs={6}>
          <UseEquipmentButton equipment={activeBackpackItem!.item} actionCallback={onBackpackItemActionCallback} />
        </Grid>
      )}
      {isRewardChest(activeBackpackItem!.item) && (
        <Grid item xs={6}>
          <FuiOpenRewardChestAction
            rewardChest={activeBackpackItem! as BackpackItem<RewardChest>}
            actionCallback={onBackpackItemActionCallback}
          />
        </Grid>
      )}
    </Grid>
  );
});

export { FuiBackpackItemControl };