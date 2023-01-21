import { FC } from 'react';
import { List, ListItem, Stack } from '@mui/material';
import { core, PersonEquipment } from '@FisherCore';
import { FuiPersonEquipment } from '../equipment';

interface EquipmentListRenderProps {
  personEquipments: Array<PersonEquipment | undefined>;
}

const EquipmentListRender: FC<EquipmentListRenderProps> = ({ personEquipments }) => (
  <List sx={{ p: 0 }}>
    {personEquipments.map((perseonEquipment, index) => (
      <ListItem key={index} sx={{ p: 0.1 }}>
        <FuiPersonEquipment personEquipment={perseonEquipment} />
      </ListItem>
    ))}
  </List>
);

const FuiMasterEquipments: FC = () => {
  const { master } = core;

  const leftEquipments = [
    master.weapon,
    master.weapon,
    master.weapon,
    master.weapon,
    master.weapon,
    master.weapon,
    master.weapon,
  ];
  const rightEquipments = [
    master.helmet,
    master.helmet,
    master.helmet,
    master.helmet,
    master.helmet,
    master.helmet,
    master.helmet,
  ];

  return (
    <Stack direction="row">
      <EquipmentListRender personEquipments={leftEquipments} />
      <EquipmentListRender personEquipments={rightEquipments} />
    </Stack>
  );
};

export { FuiMasterEquipments };
