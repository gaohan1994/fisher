import { FC, Fragment } from 'react';
import { EquipmentItem } from '@FisherCore';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';

import { useBoolean } from '../../../hook';
import { useMasterPersonEquipmentManager } from './Hook';

interface EquipmentMethodProps {
  equipment: EquipmentItem;
}
export const Remove: FC<EquipmentMethodProps> = ({ equipment }) => {
  const { slot, name } = equipment;
  const manager = useMasterPersonEquipmentManager();
  const { value, setTrue, setFalse } = useBoolean();

  const onRemove = () => {
    manager.removeEquipment(slot);
    setFalse();
  };

  return (
    <Fragment>
      <Button onClick={setTrue} variant="contained" color="error" startIcon={<DoNotDisturbOnIcon />}>
        卸下装备
      </Button>
      <Dialog open={value} onClose={setFalse} fullWidth maxWidth="xs">
        <DialogTitle>确定卸下装备 {name} 么？</DialogTitle>
        <DialogActions>
          <Button onClick={setFalse}>取消</Button>
          <Button onClick={onRemove} color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
