import { observer } from 'mobx-react';
import { Grid, Typography, Card, CardContent, CardHeader, Stack, Switch, FormControlLabel } from '@mui/material';
import { core } from '@FisherCore';
import { FuiColor, FuiContainer, FuiBackpackItemRender, FuiCoin, FuiBackpackBatchSellAction } from '@Fui';
import { backpackStore } from './BackpackStore';
import { FuiFullBackpackEquipments, FuiSlotBackpackEquipments } from './EquipmentRender';
import { FuiBackpackItemControl } from './BackpackItemControl';

const PageBackpack = observer(() => {
  const { backpack, bank } = core;
  const { showEquipmentsBySlot, activeBackpackItem, setActiveBackpackItem } = backpackStore;
  return (
    <FuiContainer>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Card sx={{ bgcolor: FuiColor.primary.background }}>
            <CardHeader
              title={
                <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                    背包
                  </Typography>
                  <FuiCoin price={bank.gold} />
                </Stack>
              }
              subheader={
                <Stack direction="row" sx={{ mt: 2 }}>
                  <FuiBackpackBatchSellAction />
                </Stack>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {backpack.items.size === 0 && <Typography>暂无物品</Typography>}
              {backpack.items.size > 0 && (
                <Stack direction="row">
                  {backpack.backpackItems.map((backpackItem) => (
                    <FuiBackpackItemRender
                      key={backpackItem.item.id}
                      backpackItem={backpackItem}
                      showBorder={activeBackpackItem?.item.id === backpackItem.item.id}
                      onClick={() => setActiveBackpackItem(backpackItem)}
                    />
                  ))}
                </Stack>
              )}
              {!showEquipmentsBySlot ? <FuiFullBackpackEquipments /> : <FuiSlotBackpackEquipments />}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <FuiBackpackItemControl />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

const FuiSlotEquipmentSwitch = observer(() => {
  const { showEquipmentsBySlot, changeSlotEquipmentVisible } = backpackStore;
  return (
    <FormControlLabel
      label={<Typography variant="body2">分类显示装备</Typography>}
      control={
        <Switch
          checked={showEquipmentsBySlot}
          color="warning"
          onChange={(event) => changeSlotEquipmentVisible(event.target.checked)}
        />
      }
    />
  );
});

export { PageBackpack };
