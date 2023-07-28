import { describe, expect, test } from 'vitest';
import { NormalItem } from '@item';
import { ComponentId } from '@shared';
import { Core } from '@core';
import { Bank } from '@bank';
import { Cart } from '../Cart';

const core = new Core();
const cart = core.getService<Cart>(ComponentId.Cart);
const bank = core.getService<Bank>(ComponentId.Bank);
const item = new NormalItem({ id: 'TestItemId', name: 'TestItemName', media: 'TestMedia', desc: 'TestDesc' });

beforeEach(() => {
  cart.clearCart();
});

describe('Cart', () => {
  test('should success calculate payment amount ', () => {
    expect(cart.paymentAmount).toEqual(0);
    expect(cart.itemIds.length).toEqual(0);

    cart.addItem(item, 1);
    expect(cart.paymentAmount).toEqual(5);
    expect(cart.itemIds.length).toEqual(1);

    cart.addItem(item, 5);
    expect(cart.paymentAmount).toEqual(30);

    cart.setItem(item, 3);
    expect(cart.paymentAmount).toEqual(15);

    cart.clearCart();
    expect(cart.paymentAmount).toEqual(0);
  });

  test('should success calculate cart limit', () => {
    expect(cart.isCartEmpty).toBeTruthy();
    expect(cart.payAvailable).toBeFalsy();
    expect(() => cart.payCart()).toThrow(`Try pay cart without items`);

    cart.setItem(item, 1);
    expect(cart.canBearPayment).toBeFalsy();
    expect(cart.payAvailable).toBeFalsy();
    expect(() => cart.payCart()).toThrow(`Sorry, credit is running low`);

    bank.receiveGold(1000);
    expect(cart.canBearPayment).toBeTruthy();
    expect(cart.payAvailable).toBeTruthy();
  });
});
