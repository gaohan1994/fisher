import React from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { Dialog, DialogTitle, DialogActions, Button, Stack } from '@mui/material';
import { FuiEquipmentDetail } from '../equipment';
import { FuiItemDetail } from '../item';
import { fuiMasterEquipmentsStore } from './EquipmentsStore';

const FuiActiveEquipmentControl: React.FC = observer(() => {
  const { master } = core;
  const { activePersonEquipment, clearActivePersonEquipment } = fuiMasterEquipmentsStore;

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const onRemoveEquipment = React.useCallback(() => {
    master.personEquipmentManager.removeEquipment(activePersonEquipment!.slot);
    clearActivePersonEquipment();
    handleClose();
  }, [activePersonEquipment]);

  if (activePersonEquipment === undefined || activePersonEquipment.isEmpty) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <FuiItemDetail item={activePersonEquipment.equipment!}>
        <FuiEquipmentDetail equipment={activePersonEquipment.equipment!} />
      </FuiItemDetail>
      <Button onClick={() => setOpen(true)}>卸下装备</Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>确定卸下装备 {activePersonEquipment!.equipment!.name} 么？</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={onRemoveEquipment} color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
});

export { FuiActiveEquipmentControl };
