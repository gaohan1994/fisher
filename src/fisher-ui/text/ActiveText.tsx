import { CircularProgress, Typography, TypographyProps } from '@mui/material';
import { FC } from 'react';

interface IFuiActiveText extends TypographyProps {
  circleProgress?: boolean;
  text: React.ReactNode;
}
const FuiActiveText: FC<IFuiActiveText> = ({ text, circleProgress = true, ...rest }) => (
  <Typography variant="caption" color="secondary" {...rest}>
    {text}
    {circleProgress && <CircularProgress sx={{ ml: 1 }} size={10} color="secondary" />}
  </Typography>
);

export { FuiActiveText };
