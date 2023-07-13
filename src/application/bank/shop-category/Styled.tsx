import { Button, ButtonProps, ListSubheader, styled } from '@mui/material';

export const ShopCategoryHeader = styled(ListSubheader)(() => ({ mb: 2, color: 'white', fontWeight: 'bold' }));

interface ActiveButtonProps extends ButtonProps {
  active: boolean;
}
export const ActiveButton = styled(({ active, ...rest }: ActiveButtonProps) => (
  <Button variant={active ? 'contained' : 'outlined'} {...rest} />
))(() => ({}));
