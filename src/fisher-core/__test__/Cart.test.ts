import { beforeEach, describe, expect, test } from 'vitest';
import { Bank } from '../fisher-bank';
import { Cart } from '../fisher-bank/Cart';
import { FisherCore } from '../fisher-core';
import { EventKeys, events } from '../fisher-events';
import { NormalItem } from '../fisher-item';

let core: FisherCore;
let bank: Bank;
let testItemData = { id: 'Test', name: '测试物品', media: '', price: 5, desc: '' };
let testItem = new NormalItem(testItemData);
beforeEach(() => {
  core = FisherCore.create();
  bank = core.bank;
  bank.clearGold();
});

describe('Cart', () => {
  test('should success calculate payment amount ', () => {
    const cart = new Cart();
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
});
