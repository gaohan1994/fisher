import { FC } from 'react';
import { observer } from 'mobx-react';
import { List, ListItem, Stack } from '@mui/material';
import { Person } from '@FisherCore';

import { FuiItem, ItemPopoverVariant } from '../item';
import { usePersonEquipmentColumns } from './Hook';
import { FuiPersonEquipment } from './PersonEquipment';

interface PersonEquipmentsProps {
  person: Person;
  variant: ItemPopoverVariant;
}
export const PersonEquipments: FC<PersonEquipmentsProps> = observer(({ person, variant }) => {
  const personEquipmentColumns = usePersonEquipmentColumns(person);
  return (
    <Stack direction="row">
      {personEquipmentColumns.map((cloumn, index) => (
        <List key={`${person.mode}-${index}-${cloumn.length}`} sx={{ p: 0 }}>
          {cloumn.map((personEquipment) => (
            <ListItem key={`${person.mode}-${personEquipment.slot}`} sx={{ p: 1 }}>
              {!personEquipment.isEmpty ? (
                <FuiPersonEquipment item={personEquipment.equipment!} variant={variant} />
              ) : (
                <FuiItem item={personEquipment.emptyEquipment as any} variant={variant} />
              )}
            </ListItem>
          ))}
        </List>
      ))}
    </Stack>
  );
});
