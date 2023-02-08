import React from 'react';
import { core } from '@FisherCore';

enum UnavailableReasons {
  Empty = '请选择您要购买的商品',
  Quantity = '请设置正确的购买数量',
  Payment = '余额不足',
}

const useCartAvailable = () => {
  const { cart } = core.bank;

  const unavailableReason = React.useMemo(() => {
    if (cart.isCartEmpty) {
      return UnavailableReasons.Empty;
    }

    if (!cart.isCartItemQuantityAvailable) {
      return UnavailableReasons.Quantity;
    }

    if (!cart.canBearPayment) {
      return UnavailableReasons.Payment;
    }

    return undefined;
  }, [cart.isCartEmpty, cart.isCartItemQuantityAvailable, cart.canBearPayment]);

  return {
    available: cart.payAvailable,
    reason: unavailableReason,
  };
};

export { useCartAvailable };
