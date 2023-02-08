import React, { PropsWithChildren, useState } from 'react';
import { observer } from 'mobx-react';
import { Card, CardContent, CardHeader, IconButton, Stack, TextField, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { core, Item } from '@FisherCore';
import { FuiColor, FuiCoin, FuiItem } from '@Fui';

interface Props {
  item: Item;
}
const FuiShopItem: React.FC<Props> = observer(({ item }) => {
  const { bank } = core;
  const [quantity, setQuantity] = useState('1');

  const onAddShopItem = () => {
    bank.cart.addItem(item, Number(quantity));
  };

  return (
    <FuiShopItemCard item={item}>
      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <TextField
            label="购买数量"
            size="small"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />
          <IconButton color="success" onClick={onAddShopItem}>
            <AddShoppingCartIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </FuiShopItemCard>
  );
});

const FuiShopItemCard: React.FC<PropsWithChildren<Props>> = ({ item, children }) => (
  <Card sx={{ bgcolor: FuiColor.primary.background }}>
    <CardHeader
      avatar={<FuiItem item={item} />}
      title={<Typography variant="caption">{item.name}</Typography>}
      subheader={<FuiCoin price={item.price} />}
    />
    {children}
  </Card>
);

export { FuiShopItem, FuiShopItemCard };