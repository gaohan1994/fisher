import { makeAutoObservable } from 'mobx';
import { Item } from './Item.js';

class CartItem<T = Item> {
  public item: T;
  public quantity: number;

  public get payment() {
    const result = (this.item as Item).price * this.quantity;
    return Math.max(Math.floor(result), 0);
  }

  constructor(item: T, quantity: number) {
    makeAutoObservable(this);

    this.item = item;
    this.quantity = quantity;
  }

  public updateQuantity = (value: number) => {
    this.quantity += value;
  };

  public setQuantity = (value: number) => {
    this.quantity = value;
  };
}

export { CartItem };
