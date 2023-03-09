import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Typography, Card, CardContent, CardHeader, Stack, Tabs, Tab, Box } from '@mui/material';
import { core } from '@FisherCore';
import { FuiColor, FuiContainer, FuiBackpackItemRender, FuiCoin, FuiBackpackBatchSellAction, FuiCardTitle } from '@Fui';
import { backpackStore, FuiBackpackTabs } from './BackpackStore';
import { FuiSlotBackpackEquipments } from './EquipmentRender';
import { FuiBackpackItemControl } from './BackpackItemControl';

const PageBackpack = () => (
  <FuiContainer>
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Card sx={{ bgcolor: FuiColor.primary.background }}>
          <PageBackpackHeader />
          <CardContent sx={{ pt: 0 }}>
            <PageBackpackTabs />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <FuiBackpackItemControl />
      </Grid>
    </Grid>
  </FuiContainer>
);

const PageBackpackHeader = observer(() => {
  const { bank } = core;
  return (
    <CardHeader
      title={
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FuiCardTitle value="背包" />
          <FuiCoin price={bank.gold} />
        </Stack>
      }
    />
  );
});

const PageBackpackTabs = observer(() => {
  const { activeTab, setActiveBackpackTab } = backpackStore;

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveBackpackTab(newValue as any);
  };

  return (
    <React.Fragment>
      <Tabs value={activeTab} onChange={handleChange} aria-label="wrapped label tabs example">
        <Tab value={FuiBackpackTabs.FullItems} label="全部" wrapped />
        <Tab value={FuiBackpackTabs.Equipments} label="装备" />
      </Tabs>

      {activeTab === FuiBackpackTabs.FullItems && <BackpackFullItemsTab />}
      {activeTab === FuiBackpackTabs.Equipments && <FuiSlotBackpackEquipments />}
    </React.Fragment>
  );
});

const BackpackFullItemsTab = observer(() => {
  const { backpack } = core;
  const { activeBackpackItem, setActiveBackpackItem } = backpackStore;

  if (backpack.items.size === 0) {
    return <Typography>暂无物品</Typography>;
  }
  return (
    <React.Fragment>
      <Box sx={{ mt: 2, mb: 2 }}>
        <FuiBackpackBatchSellAction />
      </Box>
      <Stack direction="row">
        {backpack.backpackItems.map((backpackItem) => (
          <FuiBackpackItemRender
            key={`${backpackItem.item.id}-${backpackItem.quantity}`}
            backpackItem={backpackItem}
            showBorder={activeBackpackItem?.item.id === backpackItem.item.id}
            onClick={() => setActiveBackpackItem(backpackItem)}
          />
        ))}
      </Stack>
    </React.Fragment>
  );
});

export { PageBackpack };
