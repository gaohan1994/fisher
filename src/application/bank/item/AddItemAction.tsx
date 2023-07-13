import { FC, useCallback, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Item } from '@FisherCore';

import { useCart } from '../../core';
import { StackSpaceBetween } from '../../components';

interface ItemActionProps {
  item: Item;
}
export const AddItemAction: FC<ItemActionProps> = ({ item }) => {
  const cart = useCart();
  const [value, setValue] = useState('1');

  const onAddItemToCart = useCallback(() => {
    cart.addItem(item, Number(value));
  }, [value, item.id]);

  return (
    <StackSpaceBetween>
      <TextField
        label="购买数量"
        size="small"
        type="number"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <IconButton color="success" onClick={onAddItemToCart}>
        <AddShoppingCartIcon />
      </IconButton>
    </StackSpaceBetween>
  );
};
