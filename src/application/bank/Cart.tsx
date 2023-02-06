import React from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
} from '@mui/material';
import { core } from '@FisherCore';
import { FuiCoin } from '@Fui';
import { FuiCartItem } from './CartItem';

const FuiCart = observer(() => {
  const { bank } = core;
  const { cart } = bank;
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
  return (
    <React.Fragment>
      <Card>
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
          <Button variant="contained" color="success" sx={{ width: '100%' }}>
            购买
          </Button>
        </CardActions>
      </Card>

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
