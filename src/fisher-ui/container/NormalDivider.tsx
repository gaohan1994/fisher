import { FC } from 'react';
import { Divider, DividerProps } from '@mui/material';

interface IFuiNormalDivider extends DividerProps {
  space?: number;
}
const FuiNormalDivider: FC<IFuiNormalDivider> = ({ space = 2, ...rest }) => (
  <Divider sx={{ mt: space, mb: space }} {...rest} />
);

export { FuiNormalDivider };
