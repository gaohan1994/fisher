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
  FuiEquipmentDetail,
  FuiItemDetail,
  RemoveEquipmentButton,
  FuiItemDetailPopover,
} from '@Fui';
import { masterStore } from './MasterStore';

const PageMaster: React.FC = observer(() => {
  const { master } = core;
  const { activeEquipment, clearActiveEquipment } = masterStore;
  const leftEquipments = [master.primaryWeapon, master.helmet, master.jacket, master.belt];
  const rightEquipments = [master.secondaryWeapon, master.handGuard, master.vest, master.Shoe];
  const leftJewelryEquipments = [master.necklace, master.earring];
  const rightJewelryEquipments = [master.ring, master.bracelet];

  return (
    <FuiContainer>
      <Card sx={{ bgcolor: FuiColor.primary.background, width: 'fit-content' }}>
        <CardHeader title={<Typography variant="body2">人物装备</Typography>} sx={{ pb: 0 }} />
        <CardContent>
          <Stack direction="row">
            <EquipmentColumn personEquipments={leftEquipments} />
            <EquipmentColumn personEquipments={rightEquipments} />
            <EquipmentColumn personEquipments={leftJewelryEquipments} />
            <EquipmentColumn personEquipments={rightJewelryEquipments} />
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ bgcolor: FuiColor.primary.background, mt: 2 }}>
        <CardHeader title={<Typography variant="body2">选中装备</Typography>} sx={{ pb: 0 }} />
        <CardContent>
          <Box sx={{ width: 240 }}>
            {activeEquipment === undefined ? (
              <FuiEmptyEquipmentDetail equipment={activeEquipment} />
            ) : (
              <React.Fragment>
                <RemoveEquipmentButton equipment={activeEquipment} actionCallback={clearActiveEquipment} />
                <FuiItemDetail item={activeEquipment}>
                  <FuiEquipmentDetail equipment={activeEquipment} />
                </FuiItemDetail>
              </React.Fragment>
            )}
          </Box>
        </CardContent>
      </Card>
    </FuiContainer>
  );
});

interface EquipmentColumnProps {
  personEquipments: Array<PersonEquipment>;
}
const EquipmentColumn: React.FC<EquipmentColumnProps> = observer(({ personEquipments }) => (
  <List sx={{ p: 0 }}>
    {personEquipments.map((personEquipment, index) => (
      <ListItem key={index} sx={{ p: 1 }}>
        <MasterEquipment personEquipment={personEquipment} />
      </ListItem>
    ))}
  </List>
));

interface MasterEquipmentProps {
  personEquipment: PersonEquipment;
}
const MasterEquipment: React.FC<MasterEquipmentProps> = observer(({ personEquipment }) => {
  const { activeEquipment, clearActiveEquipment } = masterStore;
  const isActiveEquipment = activeEquipment && activeEquipment?.id === personEquipment.equipment?.id;
  const props = { showBorder: isActiveEquipment };

  const actionCallback = React.useCallback(() => {
    clearActiveEquipment();
  }, []);

  const masterEquipmentActions = !personEquipment.isEmpty && (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 2 }}>
      <RemoveEquipmentButton equipment={personEquipment.equipment!} actionCallback={actionCallback} />
    </Box>
  );

  if (personEquipment.isEmpty) {
    return <FuiItem {...props} item={personEquipment.emptyEquipment as any} />;
  }

  return (
    <FuiEquipment
      {...props}
      popover={FuiItemDetailPopover.Click}
      equipment={personEquipment!.equipment!}
      popoverDetail={masterEquipmentActions}
    />
  );
});

export { PageMaster };
