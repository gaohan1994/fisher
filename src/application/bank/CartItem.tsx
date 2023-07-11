import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { observer } from 'mobx-react';
import { CartItem } from '@FisherCore';
import { FuiShopItemCard } from './ShopItem';
import React, { Fragment } from 'react';
import { useCart } from '../core';

interface Props {
  item: CartItem;
}
const FuiCartItem: React.FC<Props> = observer(({ item }) => {
  const cart = useCart();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteCartItem = () => {
    cart.deleteItem(item.item);
    handleClose();
  };
  return (
    <Fragment>
      <FuiShopItemCard key={item.item.id} item={item.item}>
        <CardContent sx={{ pt: 0 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="数量"
              size="small"
              type="number"
              value={item.quantity}
              onChange={(event) => {
                item.setQuantity(Number(event.target.value));
              }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <IconButton color="error" onClick={handleClickOpen}>
              <DeleteForeverIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </FuiShopItemCard>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'购物车信息确认'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`确定从购物车中删除 ${item.item.name} x ${item.quantity} 么?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={onDeleteCartItem} autoFocus color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});

export { FuiCartItem };
