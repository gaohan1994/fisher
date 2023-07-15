import { Fragment } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';

import { useBoolean } from '../../hook';
import { useCart } from '../../core';

export const ClearCartAction = () => {
  const cart = useCart();
  const { value, setTrue, setFalse } = useBoolean();

  const onClearCart = () => {
    cart.clearCart();
    setFalse();
  };

  return (
    <Fragment>
      <Button onClick={setTrue}>清空</Button>
      <Dialog
        open={value}
        onClose={setFalse}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        title="请确认"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{`购物车信息确认：确定清空购物车吗?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setFalse}>取消</Button>
          <Button onClick={onClearCart} autoFocus color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
