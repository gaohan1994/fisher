import React from 'react';
import { observer } from 'mobx-react';
import { Typography, Card, CardContent, CardHeader, List, ListItem, Stack, Box } from '@mui/material';
import { core, PersonEquipment } from '@FisherCore';
import {
  FuiColor,
  FuiContainer,
  FuiEquipment,
  FuiItem,
  FuiEmptyEquipmentDetail,
  FuiEmptyPersonEquipmentDetail,
  FuiEquipmentDetail,
  FuiItemDetail,
  RemoveEquipmentButton,
} from '@Fui';
import { masterStore } from './MasterStore';

const PageMaster: React.FC = observer(() => {
  const { master } = core;
  const { activePersonEquipment, setActivePersonEquipment } = masterStore;
  const leftEquipments = [master.primaryWeapon, master.helmet, master.jacket, master.belt];
  const rightEquipments = [master.secondaryWeapon, master.handGuard, master.vest, master.Shoe];
  const leftJewelryEquipments = [master.necklace, master.earring];
  const rightJewelryEquipments = [master.ring, master.bracelet];

  const renderEquipmentList = (personEquipments: Array<PersonEquipment>) => (
    <List sx={{ p: 0 }}>
      {personEquipments.map((personEquipment, index) => {
        const props = {
          onClick: () => setActivePersonEquipment(personEquipment!),
          showBorder: activePersonEquipment === personEquipment!,
        };

        return (
          <ListItem key={index} sx={{ p: 1 }}>
            {!(personEquipment && personEquipment.isEmpty) ? (
              <FuiEquipment {...props} equipment={personEquipment!.equipment!} />
            ) : (
              <FuiItem {...props} item={personEquipment.emptyEquipment as any} />
            )}
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <FuiContainer>
      <Card sx={{ bgcolor: FuiColor.primary.background, width: 'fit-content' }}>
        <CardHeader title={<Typography variant="body2">人物装备</Typography>} sx={{ pb: 0 }} />
        <CardContent>
          <Stack direction="row">
            {renderEquipmentList(leftEquipments)}
            {renderEquipmentList(rightEquipments)}
            {renderEquipmentList(leftJewelryEquipments)}
            {renderEquipmentList(rightJewelryEquipments)}
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ bgcolor: FuiColor.primary.background, mt: 2 }}>
        <CardHeader title={<Typography variant="body2">选中装备</Typography>} sx={{ pb: 0 }} />
        <CardContent>
          <Box sx={{ width: 240, bgcolor: FuiColor.primary.background }}>
            {activePersonEquipment === undefined ? (
              <FuiEmptyEquipmentDetail />
            ) : activePersonEquipment.isEmpty ? (
              <FuiEmptyPersonEquipmentDetail personEquipment={activePersonEquipment} />
            ) : (
              <FuiItemDetail item={activePersonEquipment.equipment!}>
                <RemoveEquipmentButton equipment={activePersonEquipment.equipment!} />
                <FuiEquipmentDetail equipment={activePersonEquipment.equipment!} />
              </FuiItemDetail>
            )}
          </Box>
        </CardContent>
      </Card>
    </FuiContainer>
  );
});

export { PageMaster };
