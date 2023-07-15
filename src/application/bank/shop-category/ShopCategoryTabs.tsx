import { FC } from 'react';
import { observer } from 'mobx-react';
import { ButtonGroup } from '@mui/material';

import { shopStore } from './ShopStore';
import { ActiveButton } from './Styled';
import { useCartgoryHandlers } from './Hook';

export const ShopCategoryTabs: FC = observer(() => {
  const categoryHandlers = useCartgoryHandlers();

  const {
    showAllShopCategories,
    selectedShopCategoryHandler,
    setSelectedShopCategoryHandler,
    clearSelectedShopCategoryHandler,
  } = shopStore;

  return (
    <ButtonGroup id="shop-category-tabs">
      <ActiveButton active={showAllShopCategories} onClick={clearSelectedShopCategoryHandler}>
        全部
      </ActiveButton>
      {categoryHandlers.map((handler) => (
        <ActiveButton
          key={handler.shopCategory.id}
          active={selectedShopCategoryHandler === handler}
          onClick={() => setSelectedShopCategoryHandler(handler)}
        >
          {handler.shopCategory.name}
        </ActiveButton>
      ))}
    </ButtonGroup>
  );
});
