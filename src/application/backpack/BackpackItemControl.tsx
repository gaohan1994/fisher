import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Divider, Typography } from '@mui/material';
import { BackpackItem, isEquipmentItem, isRewardChest, RewardChest, isPotion, Potion } from '@FisherCore';
import {
  FuiBackpackItemSellAction,
  FuiUseEquipmentButton,
  FuiOpenRewardChestAction,
  FuiSetPotionSlotButton,
  FuiItemDetailRender,
} from '@Fui';

import { useBackpack } from '../core';
import { ModuleCard, StackSpaceBetween } from '../components';

import { backpackStore } from './BackpackStore';

const FuiBackpackItemControl: React.FC = observer(() => {
  const { activeBackpackItem } = backpackStore;
  return (
    <ModuleCard title="物品操作台">
      <StackSpaceBetween>
        <Typography>选中物品：</Typography>
        <Typography>{activeBackpackItem === undefined ? '无' : activeBackpackItem.item.name}</Typography>
      </StackSpaceBetween>

      <StackSpaceBetween>
        <Typography>物品数量：</Typography>
        <Typography>{activeBackpackItem === undefined ? '0' : activeBackpackItem.quantity}</Typography>
      </StackSpaceBetween>

      <Divider sx={{ mt: 2, mb: 2 }} />
      {activeBackpackItem !== undefined ? (
        <FuiItemDetailRender item={activeBackpackItem.item} />
      ) : (
        <Typography>空</Typography>
      )}
      <Divider sx={{ mt: 2, mb: 2 }} />
      {activeBackpackItem !== undefined && <FuiBackpackItemActions />}
    </ModuleCard>
  );
});

const FuiBackpackItemActions: React.FC = observer(() => {
  const backpack = useBackpack();
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
          <FuiUseEquipmentButton equipment={activeBackpackItem!.item} actionCallback={onBackpackItemActionCallback} />
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
      {isPotion(activeBackpackItem!.item) && (
        <Grid item xs={6}>
          <FuiSetPotionSlotButton backpackItem={activeBackpackItem! as BackpackItem<Potion>} />
        </Grid>
      )}
    </Grid>
  );
});

export { FuiBackpackItemControl };
