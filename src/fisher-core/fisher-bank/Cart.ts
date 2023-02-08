import { makeAutoObservable } from 'mobx';
import { CartItem, Item } from '../fisher-item';
import { Reward } from '../fisher-reward';
import { Bank } from './Bank';
import { CartEventKeys, cartEvents } from './Events';

class Cart {
  private _bank: Bank;

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

  public get payAvailable() {
    return !this.isCartEmpty && this.isCartItemQuantityAvailable && this.canBearPayment;
  }

  public get isCartEmpty() {
    return this.itemMap.size === 0;
  }

  public get isCartItemQuantityAvailable() {
    let result = true;

    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];

      if (item.quantity <= 0) {
        result = false;
      }
    }

    return result;
  }

  public get canBearPayment() {
    return this._bank.checkGoldBalance(this.paymentAmount);
  }

  constructor(bank: Bank) {
    makeAutoObservable(this);
    this._bank = bank;

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

  public payCart = () => {
    if (this.isCartEmpty) {
      throw new Error('Try pay cart without items');
    }

    if (!this.isCartItemQuantityAvailable) {
      throw new Error('Try pay cart with quantity <= 0');
    }

    if (!this.canBearPayment) {
      throw new Error(`Sorry, credit is running low`);
    }

    this.runCartReward();
    this.clearCart();
  };

  private runCartReward = () => {
    const reward = new Reward();

    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];
      reward.addRewardItem(item.item, item.quantity).addRewardGold(-item.payment);
    }

    reward.execute();
  };
}

export { Cart };
