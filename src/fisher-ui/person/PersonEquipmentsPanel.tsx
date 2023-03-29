import React from 'react';
import { observer } from 'mobx-react';
import { Box, List, ListItem, Stack } from '@mui/material';
import { Person, PersonEquipment } from '@FisherCore';
import { FuiEquipment } from '../equipment';
import { FuiItem, FuiItemDetailPopover } from '../item';
import { FuiRemoveEquipmentButton } from '../backpack';

interface PersonEquipmentsPanelProps {
  person: Person;
}
const PersonEquipmentsPanel: React.FC<PersonEquipmentsPanelProps> = ({ person }) => {
  const leftEquipments = [
    person.personEquipmentManager.primaryWeapon,
    person.personEquipmentManager.helmet,
    person.personEquipmentManager.jacket,
    person.personEquipmentManager.belt,
  ];
  const rightEquipments = [
    person.personEquipmentManager.secondaryWeapon,
    person.personEquipmentManager.handGuard,
    person.personEquipmentManager.vest,
    person.personEquipmentManager.Shoe,
  ];
  const leftJewelryEquipments = [person.personEquipmentManager.necklace, person.personEquipmentManager.earring];
  const rightJewelryEquipments = [person.personEquipmentManager.ring, person.personEquipmentManager.bracelet];
  return (
    <Stack direction="row">
      <EquipmentColumn personEquipments={leftEquipments} />
      <EquipmentColumn personEquipments={rightEquipments} />
      <EquipmentColumn personEquipments={leftJewelryEquipments} />
      <EquipmentColumn personEquipments={rightJewelryEquipments} />
    </Stack>
  );
};

interface EquipmentColumnProps {
  personEquipments: Array<PersonEquipment>;
}
const EquipmentColumn: React.FC<EquipmentColumnProps> = observer(({ personEquipments }) => (
  <List sx={{ p: 0 }}>
    {personEquipments.map((personEquipment, index) => (
      <ListItem key={index} sx={{ p: 1 }}>
        <FuiPersonEquipment personEquipment={personEquipment} />
      </ListItem>
    ))}
  </List>
));

interface FuiPersonEquipmentProps {
  personEquipment: PersonEquipment;
}
const FuiPersonEquipment: React.FC<FuiPersonEquipmentProps> = observer(({ personEquipment }) => {
  const masterEquipmentActions = !personEquipment.isEmpty && (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 2 }}>
      <FuiRemoveEquipmentButton equipment={personEquipment.equipment!} />
    </Box>
  );

  if (personEquipment.isEmpty) {
    return <FuiItem item={personEquipment.emptyEquipment as any} />;
  }

  return (
    <FuiEquipment
      popover={FuiItemDetailPopover.Click}
      equipment={personEquipment!.equipment!}
      popoverDetail={masterEquipmentActions}
    />
  );
});

export { PersonEquipmentsPanel };
