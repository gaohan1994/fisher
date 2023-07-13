import { Box, styled } from '@mui/material';

export const BackpackTabContainer = styled(Box)(({ theme }) => ({
  '& #batch-sell-action': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
