import { useCart } from '../../core';

enum UnavailableReasons {
  Empty = '请选择您要购买的商品',
  Quantity = '请设置正确的购买数量',
  Payment = '余额不足',
}

export const useCartAvailable = () => {
  const cart = useCart();
  let unavailableReason = undefined;

  if (cart.isCartEmpty) {
    unavailableReason = UnavailableReasons.Empty;
  }

  if (!cart.isCartItemQuantityAvailable) {
    unavailableReason = UnavailableReasons.Quantity;
  }

  if (!cart.canBearPayment) {
    unavailableReason = UnavailableReasons.Payment;
  }

  return {
    available: cart.payAvailable,
    reason: unavailableReason,
  };
};
