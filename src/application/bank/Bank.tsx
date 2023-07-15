import React from 'react';
import { Grid } from '@mui/material';
import { FuiContainer } from '@Fui';
import { FuiShop } from './Shop';
import { FuiCart } from './Cart';

const PageBank: React.FC = () => (
  <FuiContainer>
    <Grid container spacing={2}>
      <Grid item xs>
        <FuiShop />
      </Grid>
      <Grid item xs={3}>
        <FuiCart />
      </Grid>
    </Grid>
  </FuiContainer>
);

export { PageBank };
