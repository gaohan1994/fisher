import React from 'react';
import { observer } from 'mobx-react';
import { Typography, Card, CardContent, CardHeader, List, ListItem, Stack } from '@mui/material';
import { core, PersonEquipment } from '@FisherCore';
import { EquipmentControlActions, FuiEquipment, FuiEquipmentControl } from '../equipment';
import { FuiItem } from '../item';
import { FuiColor } from '../theme';
import { fuiMasterEquipmentsStore } from './EquipmentsStore';

const FuiMasterEquipments: React.FC = observer(() => {
  const { master } = core;
  const { activePersonEquipment, setActivePersonEquipment, clearActivePersonEquipment } = fuiMasterEquipmentsStore;

  const leftEquipments = [master.primaryWeapon];
  const rightEquipments = [master.helmet];

  const onEquipmentClick = React.useCallback((personEquipment: PersonEquipment) => {
    setActivePersonEquipment(personEquipment);
  }, []);

  const renderEquipmentList = (personEquipments: Array<PersonEquipment | undefined>) => (
    <List sx={{ p: 0 }}>
      {personEquipments.map((personEquipment, index) => {
        const isActivePersonEquipment = activePersonEquipment?.slot === personEquipment?.slot;
        return (
          <ListItem key={index} sx={{ p: 0.1 }}>
            {!(personEquipment && personEquipment.isEmpty) ? (
              <FuiEquipment
                showBorder={isActivePersonEquipment}
                equipment={personEquipment!.equipment!}
                onClick={() => onEquipmentClick(personEquipment!)}
              />
            ) : (
              <FuiItem
                showBorder={isActivePersonEquipment}
                item={personEquipment.emptyEquipment as any}
                onClick={() => onEquipmentClick(personEquipment)}
              />
            )}
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      {renderEquipmentList(leftEquipments)}
      {activePersonEquipment && !activePersonEquipment.isEmpty && (
        <FuiEquipmentControl
          equipment={activePersonEquipment.equipment!}
          actions={[EquipmentControlActions.RemoveEquipment]}
          actionCallback={() => clearActivePersonEquipment()}
        />
      )}
      {renderEquipmentList(rightEquipments)}
    </Stack>
  );
});

const FuiMasterEquipmentsCard: React.FC = () => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader title={<Typography variant="body2">人物装备</Typography>} sx={{ pb: 0 }} />
    <CardContent>
      <FuiMasterEquipments />
    </CardContent>
  </Card>
);

export { FuiMasterEquipments, FuiMasterEquipmentsCard };
