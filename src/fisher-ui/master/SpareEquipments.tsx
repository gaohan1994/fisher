import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Typography, Card, CardContent, Box, Stack, Switch, FormControlLabel } from '@mui/material';
import { EquipmentItem, BackpackItem, EquipmentSlot, EquipmentSlotName, core } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiEquipment } from '../equipment';
import { useBackpackEquipments } from '../../application/hook';
import { fuiMasterEquipmentsStore } from './EquipmentsStore';

const FuiSpareEquipments: React.FC = observer(() => {
  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardContent>
        <FuiSlotEquipmentSwitch />
        <FuiFullBackpackEquipments />
        <FuiSlotBackpackEquipments />
      </CardContent>
    </Card>
  );
});

const FuiSlotEquipmentSwitch = observer(() => {
  const { showEquipmentsBySlot, changeSlotEquipmentVisible } = fuiMasterEquipmentsStore;
  return (
    <FormControlLabel
      control={
        <Switch
          checked={showEquipmentsBySlot}
          color="warning"
          onChange={(event) => changeSlotEquipmentVisible(event.target.checked)}
        />
      }
      label={<Typography variant="body2">分类显示装备</Typography>}
    />
  );
});

const FuiFullBackpackEquipments = observer(() => {
  const { backpackEquipmentList } = useBackpackEquipments();
  return <FuiSpareEquipmentRender title="所有装备" backpackEquipments={backpackEquipmentList} />;
});

const FuiSlotBackpackEquipments = observer(() => {
  const { showEquipmentsBySlot } = fuiMasterEquipmentsStore;
  const { getBackpackSlotEquipments } = useBackpackEquipments();

  const renderList = [];
  for (const slot in EquipmentSlot) {
    renderList.push(
      <FuiSpareEquipmentRender
        title={EquipmentSlotName[slot as EquipmentSlot]}
        backpackEquipments={getBackpackSlotEquipments(slot as EquipmentSlot)}
      />
    );
  }

  if (!showEquipmentsBySlot) {
    return null;
  }

  return (
    <Stack spacing={1} divider={<Divider />}>
      {renderList}
    </Stack>
  );
});

interface FuiSpareEquipmentRenderProps {
  title: React.ReactNode;
  backpackEquipments: BackpackItem<EquipmentItem>[];
}
const FuiSpareEquipmentRender: React.FC<FuiSpareEquipmentRenderProps> = observer(({ title, backpackEquipments }) => {
  const { masterUseBackpackEquipment } = useBackpackEquipments();
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {title}
        {backpackEquipments.length === 0 && ` (空)`}
      </Typography>
      {backpackEquipments.length > 0 && (
        <Stack direction="row">
          {backpackEquipments.map(({ item, quantity }) => (
            <FuiEquipment
              key={`${item.id}${quantity}`}
              equipment={item}
              onClick={() => masterUseBackpackEquipment(item)}
              showQuantity
            />
          ))}
        </Stack>
      )}
    </Box>
  );
});

export { FuiSpareEquipments };
