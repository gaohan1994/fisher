import React from 'react';
import { Grid } from '@mui/material';
import { FuiContainer } from '@Fui';
import { FuiMasterEquipmentsCard } from './Equipments';

const PageMaster: React.FC = () => {
  return (
    <FuiContainer>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FuiMasterEquipmentsCard />
        </Grid>
      </Grid>
    </FuiContainer>
  );
};

export { PageMaster };
