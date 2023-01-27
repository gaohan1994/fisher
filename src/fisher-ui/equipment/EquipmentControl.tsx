import React from 'react';
import { observer } from 'mobx-react';
import { core, EquipmentItem } from '@FisherCore';
import { Dialog, DialogTitle, DialogActions, Button, Stack } from '@mui/material';
import { FuiItemDetail } from '../item';
import { FuiEquipmentDetail } from './Equipment';

interface Props {
  equipment: EquipmentItem;
  actions?: EquipmentControlActions[];
  actionCallback?: EquipmentControlActionCallback;
}
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

const UseEquipmentButton: React.FC<EquipmentControlActionProps> = observer(({ equipment, actionCallback }) => {
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
    <React.Fragment>
      <Button onClick={onUseEquipment} variant="contained" color="success">
        使用装备
      </Button>
    </React.Fragment>
  );
});

const RemoveEquipmentButton: React.FC<EquipmentControlActionProps> = observer(({ equipment, actionCallback }) => {
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
      <Button onClick={() => setOpen(true)} variant="contained" color="secondary">
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

const FuiEquipmentControl: React.FC<Props> = observer(({ equipment, actions = [], actionCallback = () => {} }) => (
  <Stack spacing={1}>
    <FuiItemDetail item={equipment}>
      <FuiEquipmentDetail equipment={equipment} />
    </FuiItemDetail>
    {actions.length > 0 && (
      <Stack direction="row" spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        {actions.map((action) => {
          if (action === EquipmentControlActions.UseEquipment) {
            return <UseEquipmentButton equipment={equipment} actionCallback={actionCallback} />;
          }

          if (action === EquipmentControlActions.RemoveEquipment) {
            return <RemoveEquipmentButton equipment={equipment} actionCallback={actionCallback} />;
          }

          return null;
        })}
      </Stack>
    )}
  </Stack>
));

export { FuiEquipmentControl, EquipmentControlActions };
