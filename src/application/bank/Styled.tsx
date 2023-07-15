import { Box, styled } from '@mui/material';

export const ShopContainer = styled(Box)(({ theme }) => ({
  '& #shop-category-header': {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
