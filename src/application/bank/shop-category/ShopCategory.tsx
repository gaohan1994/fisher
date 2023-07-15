import { FC, Fragment } from 'react';
import { Grid } from '@mui/material';
import { ShopCategoryHandler } from '@FisherCore';
import { FuiShopItem } from '../item';
import { ShopCategoryHeader } from './Styled';
import { useShopCategoryItems, useShopCategoryName } from './Hook';

interface FuiShopCategoryProps {
  shopCategoryHandler: ShopCategoryHandler;
}
export const FuiShopCategory: FC<FuiShopCategoryProps> = ({ shopCategoryHandler }) => {
  const name = useShopCategoryName(shopCategoryHandler);
  const items = useShopCategoryItems(shopCategoryHandler);
  return (
    <Fragment>
      <ShopCategoryHeader id="shop-category-header">{name}</ShopCategoryHeader>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={4} key={item.id}>
            <FuiShopItem item={item} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};
