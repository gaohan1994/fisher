import React from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
  Box,
} from '@mui/material';
import { FuiCoin, FuiStickyCard, notifycationStore } from '@Fui';

import { useBank } from '../core';

import { FuiCartItem } from './CartItem';
import { useCartAvailable } from './Hook';

const FuiCart = observer(() => {
  const bank = useBank();
  const { cart } = bank;
  const { available, reason } = useCartAvailable();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClearCart = () => {
    cart.clearCart();
    handleClose();
  };

  const onPayCart = () => {
    if (!available) {
      return notifycationStore.alert('error', reason);
    }
    cart.payCart();
  };

  return (
    <React.Fragment>
      <FuiStickyCard>
        <CardHeader
          sx={{ pb: 0 }}
          title={
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              购物车
            </Typography>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {cart.items.map((item) => (
              <FuiCartItem key={item.item.id} item={item} />
            ))}

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant="body2">持有金币</Typography>
              <FuiCoin price={bank.gold} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant="body2">合计</Typography>
              <FuiCoin price={cart.paymentAmount} />
            </Box>
          </Stack>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClickOpen}>清空</Button>

          <Tooltip title={reason}>
            <Button
              onClick={onPayCart}
              variant="contained"
              color={available ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              购买
            </Button>
          </Tooltip>
        </CardActions>
      </FuiStickyCard>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{`购物车信息确认：确定清空购物车吗?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={onClearCart} autoFocus color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export { FuiCart };
