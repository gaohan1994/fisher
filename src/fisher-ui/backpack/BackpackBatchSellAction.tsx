import React from 'react';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  Stack,
  Checkbox,
  ButtonGroup,
} from '@mui/material';
import BallotIcon from '@mui/icons-material/Ballot';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { core } from '@FisherCore';
import { FuiBackpackItemRender } from './BackpackItemRender';

interface FuiBackpackSellItemsActionProps {
  actionCallback?: () => void;
}
const FuiBackpackBatchSellAction: React.FC<FuiBackpackSellItemsActionProps> = observer(({ actionCallback }) => {
  const { backpack } = core;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const onSelectFullBackpackItems = () => {
    backpack.items.forEach((item) => {
      backpack.addSelectItem(item);
    });
  };

  const onSellSelectedItems = () => {
    backpack.sellSelectedItems();
    handleClose();
    actionCallback?.();
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={() => setOpen(true)} color="warning" startIcon={<BallotIcon />}>
        批量出售
      </Button>
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogTitle>批量出售</DialogTitle>
        <DialogContent sx={{ overflow: 'auto', maxHeight: '50vh' }}>
          <ButtonGroup sx={{ mb: 4 }}>
            <Button startIcon={<DoneAllIcon />} onClick={onSelectFullBackpackItems}>
              全选
            </Button>
            <Button startIcon={<RestartAltIcon />} onClick={backpack.resetSelectItems}>
              重置
            </Button>
          </ButtonGroup>
          {backpack.items.size === 0 && <Typography>暂无物品</Typography>}
          {backpack.items.size > 0 && (
            <Stack direction="row">
              {backpack.backpackItems.map((backpackItem) => (
                <FuiBackpackItemRender
                  key={backpackItem.item.id}
                  backpackItem={backpackItem}
                  showBorder={backpack.selectedItems.has(backpackItem)}
                  onClick={() => backpack.toggleSelectItem(backpackItem)}
                  renderItem={() => (
                    <Checkbox
                      checked={backpack.selectedItems.has(backpackItem)}
                      sx={{ position: 'absolute', top: -15, right: -10 }}
                      size="small"
                      color="warning"
                    />
                  )}
                />
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={onSellSelectedItems} variant="contained" color="warning">
            确定（获得金币： {backpack.selectedItemsPriceAmount}）
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export { FuiBackpackBatchSellAction };
