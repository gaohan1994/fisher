import React from 'react';
import { Grid } from '@mui/material';
import { FuiSpareEquipments, FuiContainer, FuiMasterEquipmentsCard } from '@Fui';

const PageMaster: React.FC = () => {
  return (
    <FuiContainer>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <FuiMasterEquipmentsCard />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FuiSpareEquipments />
        </Grid>
      </Grid>
    </FuiContainer>
  );
};

export { PageMaster };
