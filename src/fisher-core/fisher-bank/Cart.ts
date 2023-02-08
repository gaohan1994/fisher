import { makeAutoObservable } from 'mobx';
import { CartItem, Item } from '../fisher-item';
import { CartEventKeys, cartEvents } from './Events';

class Cart {
  public itemMap = new Map<string, CartItem>();

  public get itemIds() {
    return [...this.itemMap.keys()];
  }

  public get items() {
    return [...this.itemMap.values()];
  }

  public get paymentAmount() {
    return this.items.reduce((amount, item) => (amount += item.payment), 0);
  }

  public get isCartEmpty() {
    return this.itemMap.size === 0;
  }

  constructor() {
    makeAutoObservable(this);

    cartEvents.on(CartEventKeys.AddItem, this.addItem);
    cartEvents.on(CartEventKeys.SetItem, this.setItem);
    cartEvents.on(CartEventKeys.DeleteItem, this.deleteItem);
    cartEvents.on(CartEventKeys.ClearItem, this.clearCart);
  }

  public addItem = (item: Item, quantity: number) => {
    if (quantity <= 0) {
      throw new Error(`Fail to add item ${item.id} with quantity: ${quantity}`);
    }

    if (this.itemMap.has(item.id)) {
      this.addExistingItemToCart(item, quantity);
    } else {
      this.setItem(item, quantity);
    }
  };

  private addExistingItemToCart = (item: Item, quantity: number) => {
    const cartItem = this.itemMap.get(item.id)!;
    cartItem.updateQuantity(quantity);
    this.itemMap.set(item.id, cartItem);
  };

  public deleteItem = (item: Item) => {
    this.itemMap.delete(item.id);
  };

  public setItem = (item: Item, quantity: number) => {
    this.itemMap.set(item.id, new CartItem(item, quantity));
  };

  public clearCart = () => {
    this.itemMap.clear();
  };
}

export { Cart };