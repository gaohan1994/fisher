import { forwardRef } from 'react';
import { Button, ButtonProps, CardActions, styled } from '@mui/material';

export const CartActionsContainer = styled(CardActions)(({ theme }) => ({
  paddingTop: 0,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

interface IPayButton extends ButtonProps {
  available: boolean;
}
const _PayButton = forwardRef(({ available, ...rest }: IPayButton, ref: React.Ref<any>) => (
  <Button variant="contained" color={available ? 'success' : 'error'} {...rest} ref={ref} />
));

export const PayButton = styled(_PayButton)(() => ({ width: '100%' }));
