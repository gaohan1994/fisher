import { describe, expect, test } from 'vitest';
import { CartItem } from '../../fisher-item';
import { store } from '../../fisher-packages';

describe('CartItem', () => {
  test('should success generate cart item', () => {
    const item = store.findItemById('WoodSword');
    const cartItem = new CartItem(item, 1);

    expect(cartItem.item).toStrictEqual(item);
    expect(cartItem.quantity).toEqual(1);
    expect(cartItem.payment).toEqual(5);
  });

  test('should success calculate payment after quantity change', () => {
    const item = store.findItemById('WoodSword');
    const cartItem = new CartItem(item, 1);

    cartItem.updateQuantity(5);
    expect(cartItem.payment).toEqual(30);

    cartItem.setQuantity(10);
    expect(cartItem.payment).toEqual(50);
  });
});
