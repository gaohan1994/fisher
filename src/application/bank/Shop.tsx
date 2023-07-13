import React from 'react';
import { observer } from 'mobx-react';

import { ShopContainer } from './Styled';
import { useActiveShopCategoryHandlers } from './Hook';
import { FuiShopCategory, ShopCategoryTabs } from './shop-category';

const FuiShop: React.FC = observer(() => {
  const handlers = useActiveShopCategoryHandlers();
  return (
    <ShopContainer>
      <ShopCategoryTabs />
      {handlers.map((categoryHandler) => (
        <FuiShopCategory
          key={`${categoryHandler.categoryItemMap.size}-${categoryHandler.shopCategory.id}`}
          shopCategoryHandler={categoryHandler}
        />
      ))}
    </ShopContainer>
  );
});

export { FuiShop };
