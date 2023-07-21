import { styled } from '@mui/material';
import { FuiContainer } from '../components';

export const MasterContainer = styled(FuiContainer)(({ theme }) => ({
  '& #module-card': {
    marginBottom: theme.spacing(2),
  },
}));
