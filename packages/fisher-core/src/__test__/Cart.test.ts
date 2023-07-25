import { beforeEach, describe, expect, test } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { Bank } from '../fisher-bank';
import { FisherCore } from '../fisher-core';
import { NormalItem } from '../fisher-item';

let core: FisherCore;
let bank: Bank;
let backpack: Backpack;
let testItemData = { id: 'Test', name: '测试物品', media: '', price: 5, desc: '' };
let testItem = new NormalItem(testItemData);
beforeEach(() => {
  core = FisherCore.create();
  bank = core.bank;
  bank.clearGold();
  backpack = core.backpack;
  backpack.items.clear();
  bank.cart.clearCart();
});

describe('Cart', () => {
  test('should success calculate payment amount ', () => {
    const { cart } = bank;
    expect(cart.paymentAmount).toEqual(0);
    expect(cart.itemIds.length).toEqual(0);

    cart.addItem(testItem, 1);
    expect(cart.paymentAmount).toEqual(5);
    expect(cart.itemIds.length).toEqual(1);

    cart.addItem(testItem, 5);
    expect(cart.paymentAmount).toEqual(30);

    cart.setItem(testItem, 3);
    expect(cart.paymentAmount).toEqual(15);

    cart.clearCart();
    expect(cart.paymentAmount).toEqual(0);
  });

  test('should success calculate cart limit', () => {
    const { cart } = bank;
    expect(cart.isCartEmpty).toBeTruthy();
    expect(cart.payAvailable).toBeFalsy();
    expect(() => cart.payCart()).toThrow(`Try pay cart without items`);

    cart.setItem(testItem, 1);
    expect(cart.canBearPayment).toBeFalsy();
    expect(cart.payAvailable).toBeFalsy();
    expect(() => cart.payCart()).toThrow(`Sorry, credit is running low`);

    bank.receiveGold(1000);
    expect(cart.canBearPayment).toBeTruthy();
    expect(cart.payAvailable).toBeTruthy();
  });

  test('should success pay cart', () => {
    const { cart } = bank;
    cart.addItem(testItem, 1);
    bank.receiveGold(1000);

    cart.payCart();

    expect(cart.itemMap.size).toEqual(0);
    expect(bank.gold).toEqual(995);
    expect(backpack.checkItem(testItem)).toBeTruthy();
    expect(backpack.getItem(testItem)?.quantity).toBe(1);
  });
});
