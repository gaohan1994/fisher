import { FC, Fragment, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { CartItem } from '@FisherCore';

import { useCart } from '../../core';
import { StackSpaceBetween } from '../../components';
import { useBoolean } from '../../hook';

interface UpdateItemActionProps {
  item: CartItem;
}
export const UpdateItemAction: FC<UpdateItemActionProps> = observer(({ item }) => {
  const cart = useCart();
  const { value, setTrue, setFalse } = useBoolean();

  const onDeleteCartItem = useCallback(() => {
    cart.deleteItem(item.item);
    setFalse();
  }, [cart]);

  return (
    <Fragment>
      <StackSpaceBetween>
        <TextField
          label="数量"
          size="small"
          type="number"
          value={item.quantity}
          onChange={(event) => item.setQuantity(Number(event.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />

        <IconButton color="error" onClick={setTrue}>
          <DeleteForeverIcon />
        </IconButton>
      </StackSpaceBetween>
      <Dialog
        open={value}
        onClose={setFalse}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        title="购物车信息确认"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`确定从购物车中删除 ${item.item.name} x ${item.quantity} 么?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setFalse}>取消</Button>
          <Button onClick={onDeleteCartItem} autoFocus color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});
