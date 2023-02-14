import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Typography, Card, CardContent, CardHeader, List, ListItem, Stack } from '@mui/material';
import { core, PersonEquipment } from '@FisherCore';
import { FuiEquipment, RemoveEquipmentButton } from '../../fisher-ui/equipment';
import { FuiItem } from '../../fisher-ui/item';
import { FuiColor } from '../../fisher-ui/theme';

const FuiMasterEquipments: React.FC = observer(() => {
  const { master } = core;

  const leftEquipments = [master.primaryWeapon, master.helmet, master.jacket, master.belt];
  const rightEquipments = [master.secondaryWeapon, master.handGuard, master.vest, master.Shoe];
  const leftJewelryEquipments = [master.necklace, master.earring];
  const rightJewelryEquipments = [master.ring, master.bracelet];

  const renderEquipmentList = (personEquipments: Array<PersonEquipment | undefined>) => (
    <List sx={{ p: 0 }}>
      {personEquipments.map((personEquipment, index) => {
        return (
          <ListItem key={index} sx={{ pl: 0, pr: 2, flexDirection: 'column' }}>
            {!(personEquipment && personEquipment.isEmpty) ? (
              <Fragment>
                <FuiEquipment equipment={personEquipment!.equipment!} />
                <RemoveEquipmentButton equipment={personEquipment!.equipment!} />
              </Fragment>
            ) : (
              <FuiItem item={personEquipment.emptyEquipment as any} />
            )}
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Stack direction="row">
      {renderEquipmentList(leftEquipments)}
      {renderEquipmentList(rightEquipments)}
      {renderEquipmentList(leftJewelryEquipments)}
      {renderEquipmentList(rightJewelryEquipments)}
    </Stack>
  );
});

const FuiMasterEquipmentsCard: React.FC = () => (
  <Card sx={{ bgcolor: FuiColor.primary.background, width: 'fit-content' }}>
    <CardHeader title={<Typography variant="body2">人物装备</Typography>} sx={{ pb: 0 }} />
    <CardContent>
      <FuiMasterEquipments />
    </CardContent>
  </Card>
);

export { FuiMasterEquipments, FuiMasterEquipmentsCard };
