import { FC, PropsWithChildren } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface IGoldenButton extends ButtonProps {}
const GoldenButton: FC<PropsWithChildren<IGoldenButton>> = ({ children, ...rest }) => (
  <Button color="warning" variant="contained" {...rest}>
    {children}
  </Button>
);

export { GoldenButton };
