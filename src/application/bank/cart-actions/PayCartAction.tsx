import { useCallback } from 'react';
import { Tooltip } from '@mui/material';

import { notifycationStore } from '../../../fisher-ui/notifycation';
import { useCart } from '../../core';
import { PayButton } from './Styled';
import { useCartAvailable } from './Hook';

export const PayCartAction = () => {
  const cart = useCart();
  const { available, reason } = useCartAvailable();

  const onPayCart = useCallback(() => {
    if (!available) {
      return notifycationStore.alert('error', reason);
    }
    cart.payCart();
  }, [available, reason]);

  return (
    <Tooltip title={reason}>
      <PayButton onClick={onPayCart} available={available}>
        购买
      </PayButton>
    </Tooltip>
  );
};
