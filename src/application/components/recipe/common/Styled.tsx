import { Button, ButtonProps, styled } from '@mui/material';

export const RecipeButton = styled(({ ...rest }: ButtonProps) => <Button variant="contained" {...rest} />)(() => ({
  width: '100%',
}));
