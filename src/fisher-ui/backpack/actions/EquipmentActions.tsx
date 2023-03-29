import React from 'react';
import { observer } from 'mobx-react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { core, EquipmentItem } from '@FisherCore';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';

interface EquipmentControlActionProps {
  equipment: EquipmentItem;
  actionCallback?: EquipmentControlActionCallback;
}
interface EquipmentControlActionCallback {
  (action: EquipmentControlActions): void;
}
enum EquipmentControlActions {
  UseEquipment = 'UseEquipment',
  RemoveEquipment = 'RemoveEquipment',
}

const FuiUseEquipmentButton: React.FC<EquipmentControlActionProps> = observer(({ equipment, actionCallback }) => {
  const { master } = core;
  const onUseEquipment = React.useCallback(() => {
    const currentSlotPersonEquipment = master.personEquipmentManager.equipmentMap.get(equipment.slot)!;
    const currentSlotPersonEquipmentIsEmpty = currentSlotPersonEquipment.isEmpty;
    const currentSlotEquipmentSameAsPassedEquipment = currentSlotPersonEquipment.equipment?.id === equipment.id;

    if (!currentSlotPersonEquipmentIsEmpty && currentSlotEquipmentSameAsPassedEquipment) {
      return;
    }

    master.personEquipmentManager.useEquipment(equipment);
    actionCallback?.(EquipmentControlActions.UseEquipment);
  }, [equipment, actionCallback]);
  return (
    <Button onClick={onUseEquipment} variant="contained" color="success" startIcon={<VerifiedUserIcon />}>
      使用装备
    </Button>
  );
});

const FuiRemoveEquipmentButton: React.FC<EquipmentControlActionProps> = observer(({ equipment, actionCallback }) => {
  const { master } = core;

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const onRemoveEquipment = React.useCallback(() => {
    master.personEquipmentManager.removeEquipment(equipment.slot);
    actionCallback?.(EquipmentControlActions.RemoveEquipment);
    handleClose();
  }, [equipment, actionCallback]);
  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)} variant="contained" color="error" startIcon={<DoNotDisturbOnIcon />}>
        卸下装备
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>确定卸下装备 {equipment.name} 么？</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={onRemoveEquipment} color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export { FuiUseEquipmentButton, FuiRemoveEquipmentButton, EquipmentControlActions };
