import { ItemType } from './Item.js';

interface IShopCategory {
  id: string;
  name: string;
  itemIds: string[];
}
class ShopCategory {
  public type = ItemType.Normal;

  public id: string;

  public name: string;

  public itemIds: string[];

  constructor({ id, name, itemIds }: IShopCategory) {
    this.id = id;
    this.name = name;
    this.itemIds = itemIds;
  }
}

export { ShopCategory };
export type { IShopCategory };
