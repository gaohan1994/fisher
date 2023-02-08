import { makeAutoObservable } from 'mobx';
import { ShopCategoryHandler } from '@FisherCore';

class ShopStore {
  public selectedShopCategoryHandler?: ShopCategoryHandler = undefined;

  public get showAllShopCategories() {
    return this.selectedShopCategoryHandler === undefined;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setSelectedShopCategoryHandler = (value: ShopCategoryHandler) => {
    this.selectedShopCategoryHandler = value;
  };

  public clearSelectedShopCategoryHandler = () => {
    this.selectedShopCategoryHandler = undefined;
  };
}

const shopStore = new ShopStore();
export { shopStore };
