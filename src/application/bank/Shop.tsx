import React from 'react';
import { observer } from 'mobx-react';
import { Box, Grid, ListSubheader, ButtonGroup, Button } from '@mui/material';
import { core, ShopCategoryHandler } from '@FisherCore';
import { FuiShopItem } from './ShopItem';
import { shopStore } from './ShopStore';

const PageShop: React.FC = observer(() => {
  const { showAllShopCategories, selectedShopCategoryHandler } = shopStore;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <FuiShopCategoroesButtonGroup />
      {showAllShopCategories && <FuiFullShopCategories />}
      {selectedShopCategoryHandler !== undefined && <FuiShopCategory categoryHandler={selectedShopCategoryHandler} />}
    </Box>
  );
});

const FuiShopCategoroesButtonGroup: React.FC = observer(() => {
  const { categoryHandlers } = core.bank;
  const {
    showAllShopCategories,
    selectedShopCategoryHandler,
    setSelectedShopCategoryHandler,
    clearSelectedShopCategoryHandler,
  } = shopStore;
  return (
    <ButtonGroup sx={{ mb: 2 }}>
      <Button variant={showAllShopCategories ? 'contained' : 'outlined'} onClick={clearSelectedShopCategoryHandler}>
        全部
      </Button>
      {categoryHandlers.map((handler) => (
        <Button
          key={handler.shopCategory.id}
          variant={selectedShopCategoryHandler === handler ? 'contained' : 'outlined'}
          onClick={() => setSelectedShopCategoryHandler(handler)}
        >
          {handler.shopCategory.name}
        </Button>
      ))}
    </ButtonGroup>
  );
});

const FuiFullShopCategories: React.FC = observer(() => {
  const { bank } = core;
  const { categoryHandlers } = bank;
  return (
    <React.Fragment>
      {categoryHandlers.map((categoryHandler) => (
        <FuiShopCategory key={categoryHandler.shopCategory.id} categoryHandler={categoryHandler} />
      ))}
    </React.Fragment>
  );
});

interface FuiShopCategoryProps {
  categoryHandler: ShopCategoryHandler;
}
const FuiShopCategory: React.FC<FuiShopCategoryProps> = ({ categoryHandler }) => {
  return (
    <React.Fragment>
      <ListSubheader sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
        {categoryHandler.shopCategory.name}
      </ListSubheader>
      <Grid container spacing={2}>
        {categoryHandler.categoryItems.map((item) => (
          <Grid item xs={4} key={item.id} sx={{ mb: 2 }}>
            <FuiShopItem item={item} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export { PageShop };
