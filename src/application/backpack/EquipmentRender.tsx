import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Typography, Box, Stack } from '@mui/material';
import { EquipmentItem, BackpackItem, EquipmentSlot, EquipmentSlotName } from '@FisherCore';
import { FuiEquipment } from '../../fisher-ui/equipment';
import { useBackpackEquipments } from '../hook';
import { backpackStore } from './BackpackStore';

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
  const { activeEquipment, setActiveEquipment } = backpackStore;
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
              showBorder={activeEquipment?.id === item.id}
              equipment={item}
              onClick={() => setActiveEquipment(item)}
              showQuantity
            />
          ))}
        </Stack>
      )}
    </Box>
  );
});

export { FuiFullBackpackEquipments, FuiSlotBackpackEquipments };
