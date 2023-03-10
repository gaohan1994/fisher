import React from 'react';
import { observer } from 'mobx-react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { RewardChestHandler, RewardChest, BackpackItem } from '@FisherCore';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  Button,
  ButtonGroup,
  Grid,
} from '@mui/material';
import { FuiBackpackItemDetailRender } from './BackpackItemRender';
import { PrettoSlider } from './PrettoSlider';

interface FuiOpenRewardChestActionProps {
  rewardChest: BackpackItem<RewardChest>;
  actionCallback?: () => void;
}
const FuiOpenRewardChestAction: React.FC<FuiOpenRewardChestActionProps> = observer(
  ({ rewardChest, actionCallback }) => {
    const [open, setOpen] = React.useState(false);
    const [quantity, setQuantity] = React.useState(0);
    const handleClose = () => setOpen(false);

    React.useEffect(() => {
      setQuantity(rewardChest.quantity);
    }, []);

    const sellOneItem = () => {
      setQuantity(1);
    };

    const stayOneItem = () => {
      setQuantity(rewardChest.quantity - 1);
    };

    const setFullQuantity = () => {
      setQuantity(rewardChest.quantity);
    };

    const onOpenRewardChest = React.useCallback(() => {
      RewardChestHandler.openRewardChestBatches(rewardChest.item, quantity);
      actionCallback?.();
      handleClose();
    }, [rewardChest, quantity, actionCallback]);

    return (
      <React.Fragment>
        <Button variant="contained" onClick={() => setOpen(true)} color="success" startIcon={<AddCircleIcon />}>
          打开宝箱
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>出售物品</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <Grid container spacing={4}>
              <Grid item xs={5}>
                <FuiBackpackItemDetailRender backpackItem={rewardChest} />
              </Grid>
              <Grid item xs>
                <Typography>物品数量：{rewardChest.quantity}</Typography>
                <Typography>打开数量：{quantity}</Typography>
                <PrettoSlider
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  value={quantity}
                  max={rewardChest.quantity}
                  onChange={(_, value) => setQuantity(value as number)}
                />
                <ButtonGroup fullWidth>
                  <Button onClick={sellOneItem} variant="contained" color="warning">
                    只开一个
                  </Button>
                  <Button onClick={stayOneItem} variant="contained" color="warning">
                    只留一个
                  </Button>
                  <Button onClick={setFullQuantity} variant="contained" color="warning">
                    全部打开
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>取消</Button>

            <Button onClick={onOpenRewardChest} variant="contained" color="warning">
              确定（打开：{quantity}个宝箱）
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
);

export { FuiOpenRewardChestAction };
