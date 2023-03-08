import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { Card, CardContent, CardHeader, List, ListItem, Stack, Box, Divider } from '@mui/material';
import { core, PersonEquipment } from '@FisherCore';
import {
  FuiColor,
  FuiContainer,
  FuiEquipment,
  FuiItem,
  RemoveEquipmentButton,
  FuiItemDetailPopover,
  FuiCardTitle,
  FuiPersonAttributePanel,
} from '@Fui';
import { PageBackpack } from '../backpack';
import { masterStore } from './MasterStore';

interface MasterCardProps {
  title: string;
}
const MasterCard: React.FC<PropsWithChildren<MasterCardProps>> = ({ title, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background, width: 'fit-content' }}>
    <CardHeader title={<FuiCardTitle value={title} />} sx={{ pb: 0 }} />
    <CardContent>{children}</CardContent>
  </Card>
);

const PageMaster: React.FC = observer(() => {
  const { master } = core;
  const leftEquipments = [master.primaryWeapon, master.helmet, master.jacket, master.belt];
  const rightEquipments = [master.secondaryWeapon, master.handGuard, master.vest, master.Shoe];
  const leftJewelryEquipments = [master.necklace, master.earring];
  const rightJewelryEquipments = [master.ring, master.bracelet];

  return (
    <React.Fragment>
      <FuiContainer>
        <Stack direction="row" spacing={2}>
          <MasterCard title="人物装备">
            <Stack direction="row">
              <EquipmentColumn personEquipments={leftEquipments} />
              <EquipmentColumn personEquipments={rightEquipments} />
              <EquipmentColumn personEquipments={leftJewelryEquipments} />
              <EquipmentColumn personEquipments={rightJewelryEquipments} />
            </Stack>
          </MasterCard>
          <MasterCard title="属性">
            <FuiPersonAttributePanel person={master.person} />
          </MasterCard>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />
      </FuiContainer>
      <PageBackpack />
    </React.Fragment>
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
