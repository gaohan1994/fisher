import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  Grid,
  ButtonGroup,
  Checkbox,
  Stack,
} from '@mui/material';
import EuroIcon from '@mui/icons-material/Euro';
import BallotIcon from '@mui/icons-material/Ballot';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Backpack, BackpackItem, core } from '@FisherCore';
import { PrettoSlider } from '../PrettoSlider';
import { notifycationStore } from '../../notifycation';
import { FuiItemDetailRender, FuiItemRender } from '../../item';

interface BackpackItemSellActionProps {
  backpackItem: BackpackItem;
  actionCallback?: (backpack: Backpack) => void;
}
const FuiBackpackItemSellAction: React.FC<BackpackItemSellActionProps> = observer(
  ({ backpackItem, actionCallback }) => {
    const { backpack } = core;
    const [open, setOpen] = React.useState(false);
    const [sellQuantity, setSellQuantity] = React.useState(0);

    useEffect(() => {
      setSellQuantity(backpackItem.quantity);

      return () => {
        setSellQuantity(0);
      };
    }, [backpackItem]);

    const handleClose = () => setOpen(false);

    const onSellItems = React.useCallback(() => {
      try {
        const _backpack = backpack.sellItem(backpackItem, sellQuantity);
        actionCallback?.(_backpack);
        handleClose();
      } catch (error) {
        notifycationStore.alert('error', '卖出物品失败');
      }
    }, [backpackItem, sellQuantity, actionCallback]);

    const sellOneItem = React.useCallback(() => {
      setSellQuantity(1);
    }, []);

    const stayOneItem = React.useCallback(() => {
      setSellQuantity(backpackItem.quantity - 1);
    }, [backpackItem]);

    const sellFullItems = React.useCallback(() => {
      setSellQuantity(backpackItem.quantity);
    }, [backpackItem]);

    return (
      <React.Fragment>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ width: '100%' }}
          color="warning"
          startIcon={<EuroIcon />}
        >
          出售物品
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>出售物品</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <Grid container spacing={4}>
              <Grid item xs={5}>
                <FuiItemDetailRender item={backpackItem.item} />
              </Grid>
              <Grid item xs>
                <Typography>物品数量：{backpackItem.quantity}</Typography>
                <Typography>出售数量：{sellQuantity}</Typography>
                <PrettoSlider
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  value={sellQuantity}
                  max={backpackItem.quantity}
                  onChange={(_, value) => setSellQuantity(value as number)}
                />
                <ButtonGroup fullWidth>
                  <Button onClick={sellOneItem} variant="contained" color="warning">
                    只卖一份
                  </Button>
                  <Button onClick={stayOneItem} variant="contained" color="warning">
                    只留一份
                  </Button>
                  <Button onClick={sellFullItems} variant="contained" color="warning">
                    全部卖出
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>取消</Button>

            <Button onClick={onSellItems} variant="contained" color="warning">
              确定（获得金币：{backpackItem.calculatePrice(sellQuantity)}）
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
);

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
      <Button
        id="batch-sell-action"
        variant="contained"
        onClick={() => setOpen(true)}
        color="warning"
        startIcon={<BallotIcon />}
      >
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
                <FuiItemRender
                  key={backpackItem.item.id}
                  item={backpackItem.item}
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

export { FuiBackpackItemSellAction, FuiBackpackBatchSellAction };
