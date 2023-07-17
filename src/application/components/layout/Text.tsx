import { FC, ReactNode } from 'react';
import { Box, CircularProgress, Typography, TypographyProps, styled } from '@mui/material';

interface ICardHeaderText extends TypographyProps {}
export const CardHeaderText = styled((props: ICardHeaderText) => (
  <Typography id="card-header-text" variant="h5" {...props} />
))(() => ({
  fontWeight: 'bold',
}));

interface ActiveTextProps extends TypographyProps {
  circleProgress?: boolean;
}
export const ActiveText: FC<ActiveTextProps> = ({ circleProgress = true, children, ...rest }) => (
  <Typography variant="caption" color="secondary" {...rest}>
    {children}
    {circleProgress && <CircularProgress sx={{ ml: 1 }} size={10} color="secondary" />}
  </Typography>
);

const IconTextBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiAvatar-root, & .MuiSvgIcon-root': { marginRight: theme.spacing(1) },
}));

interface IconTextProps extends TypographyProps {
  icon: ReactNode;
}
export const IconText: FC<IconTextProps> = ({ icon = null, ...rest }) => (
  <IconTextBox>
    {icon}
    <Typography variant="caption" {...rest} />
  </IconTextBox>
);
