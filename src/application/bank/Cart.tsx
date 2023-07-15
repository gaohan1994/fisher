import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { FuiCoin } from '@Fui';

import { ModuleStickyCard, StackSpaceBetween } from '../components';
import { CartActions } from './cart-actions';
import { FuiCartItem } from './item';
import { useBankGold, useCartItems, useCartPayment } from './Hook';

const FuiCart = observer(() => {
  const gold = useBankGold();
  const items = useCartItems();
  const payment = useCartPayment();
  const renderInfo = [
    ['持有金币', gold],
    ['合计', payment],
  ] as const;

  return (
    <ModuleStickyCard title="购物车" backgroundColor="theme.paper.background" actions={<CartActions />}>
      {items.map((item) => (
        <FuiCartItem key={item.item.id} item={item} />
      ))}
      {renderInfo.map(([info, value]) => (
        <StackSpaceBetween key={`${info}-${value}`} sx={{ mt: 2 }}>
          <Typography variant="body2">{info}</Typography>
          <FuiCoin price={value} />
        </StackSpaceBetween>
      ))}
    </ModuleStickyCard>
  );
});

export { FuiCart };
