import styled from '@emotion/styled';
import { AppBar, Box, Typography, TypographyProps } from '@mui/material';
import { FuiColor } from '../theme';

export const AppBarContainer = styled(AppBar)(({ theme }: any) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: FuiColor.primary.background,
}));

export const AppbarTypography = styled(Typography)<TypographyProps>(() => ({ ml: 1, flexGrow: 1 }));

export const AppbarActionsContainer = styled(Box)(({ theme }: any) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '& .MuiButtonBase-root': {
    marginLeft: theme.spacing(1),
  },
}));
