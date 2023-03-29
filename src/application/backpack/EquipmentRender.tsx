import React from 'react';
import { observer } from 'mobx-react';
import { Divider, Typography, Box, Stack } from '@mui/material';
import { EquipmentItem, BackpackItem, EquipmentSlot, EquipmentSlotName } from '@FisherCore';
import { FuiEquipment } from '@Fui';
import { useBackpackEquipments } from '../hook';
import { backpackStore } from './BackpackStore';

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
  const { activeBackpackItem, setActiveBackpackItem } = backpackStore;
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {title}
        {backpackEquipments.length === 0 && ` (空)`}
      </Typography>
      {backpackEquipments.length > 0 && (
        <Stack direction="row">
          {backpackEquipments.map((backpackItem) => (
            <FuiEquipment
              key={`${backpackItem.item.id}${backpackItem.quantity}`}
              showQuantity
              showBorder={activeBackpackItem?.item?.id === backpackItem.item.id}
              equipment={backpackItem.item}
              onClick={() => setActiveBackpackItem(backpackItem)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
});

export { FuiSlotBackpackEquipments };
