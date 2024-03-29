import { ShopCategory } from '@item';
import { store } from '../fisher-packages/index.js';

class ShopCategoryHandler {
  public readonly shopCategory: ShopCategory;

  public categoryItemMap = new Map<string, any>();

  public get categoryItems() {
    return [...this.categoryItemMap.values()];
  }

  constructor(shopCategory: ShopCategory) {
    this.shopCategory = shopCategory;

    this.shopCategory.itemIds.forEach((id) => {
      this.categoryItemMap.set(id, store.findItemById(id));
    });
  }
}

export { ShopCategoryHandler };
