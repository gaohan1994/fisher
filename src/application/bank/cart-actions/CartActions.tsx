import { ClearCartAction } from './ClearCartAction';
import { PayCartAction } from './PayCartAction';
import { CartActionsContainer } from './Styled';

export const CartActions = () => (
  <CartActionsContainer>
    <ClearCartAction />
    <PayCartAction />
  </CartActionsContainer>
);
