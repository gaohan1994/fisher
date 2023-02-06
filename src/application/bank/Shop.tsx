import React from 'react';
import { observer } from 'mobx-react';
import { Box, Grid, ListSubheader } from '@mui/material';
import { core } from '@FisherCore';
import { FuiShopItem } from './ShopItem';

const PageShop: React.FC = observer(() => {
  const { bank } = core;
  const { categoryHandlers } = bank;
  return (
    <Box sx={{ flexGrow: 1 }}>
      {categoryHandlers.map((categoryHandler) => {
        return (
          <React.Fragment key={categoryHandler.shopCategory.id}>
            <ListSubheader sx={{ mb: 2 }}>{categoryHandler.shopCategory.name}</ListSubheader>
            <Grid container spacing={2}>
              {categoryHandler.categoryItems.map((item) => (
                <Grid item xs={4} key={item.id} sx={{ mb: 2 }}>
                  <FuiShopItem item={item} />
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        );
      })}
    </Box>
  );
});

export { PageShop };
