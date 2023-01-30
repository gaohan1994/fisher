import React from 'react';
import { observer } from 'mobx-react';
import {
  Divider,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { EquipmentItem, BackpackItem, EquipmentSlot, EquipmentSlotName } from '@FisherCore';
import { FuiColor, FuiSize } from '../theme';
import { EquipmentControlActions, FuiEquipment, FuiEquipmentControl } from '../equipment';
import { useBackpackEquipments } from '../../application/hook';
import { fuiMasterEquipmentsStore } from './EquipmentsStore';

const FuiSpareEquipments: React.FC = observer(() => {
  const { showEquipmentsBySlot, activeSpareEquipment, clearActiveSpareEquipment } = fuiMasterEquipmentsStore;
  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardHeader title={<FuiSlotEquipmentSwitch />} sx={{ pb: 0 }} />
      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            {!showEquipmentsBySlot ? <FuiFullBackpackEquipments /> : <FuiSlotBackpackEquipments />}
          </div>
          <div style={{ width: FuiSize.item.detail }}>
            {activeSpareEquipment && (
              <FuiEquipmentControl
                equipment={activeSpareEquipment}
                actions={[EquipmentControlActions.UseEquipment]}
                actionCallback={() => clearActiveSpareEquipment()}
              />
            )}
          </div>
        </Stack>
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
  const { activeSpareEquipment, setActiveSpareEquipment } = fuiMasterEquipmentsStore;
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
              showBorder={activeSpareEquipment?.id === item.id}
              equipment={item}
              onClick={() => setActiveSpareEquipment(item)}
              showQuantity
            />
          ))}
        </Stack>
      )}
    </Box>
  );
});

export { FuiSpareEquipments };
