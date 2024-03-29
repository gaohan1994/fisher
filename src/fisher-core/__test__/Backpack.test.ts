/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { Bank } from '../fisher-bank';
import { FisherCore } from '../fisher-core';
import { EventKeys, events } from '../fisher-events';
import { ItemType, NormalItem, TestItem } from '../fisher-item';
import { Store } from '../fisher-packages';

let store: Store;
let core: FisherCore;
let bank: Bank;

beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
  core.backpack.items.clear();
  bank = core.bank;
  bank.gold = 0;
});

const testBackpackItemPayload = {
  id: 'LowSpiritMine',
  name: '低灵矿石',
  desc: '一种很常见的矿石，灵气和纯度较低',
  media: '',
  price: 5,
};

describe('Backpack', () => {
  describe('backpack get interface', () => {
    test('should return undefined if backpack donst have item ', () => {
      const backpack = core.backpack;
      const item = new NormalItem(testBackpackItemPayload);

      expect(backpack.getItem(item)).toBeUndefined();
      expect(backpack.getItemById(item.id)).toBeUndefined();
    });

    test('should return item', () => {
      const backpack = core.backpack;
      const item = new NormalItem(testBackpackItemPayload);
      backpack.addItem(item, 10);

      expect(backpack.getItem(item)?.item).toStrictEqual(item);
      expect(backpack.getItemById(item.id)?.item).toStrictEqual(item);
    });
  });

  describe('backpack check item interface', () => {
    test('should return true if backpack has item', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 10);

      expect(backpack.checkItem(item)).toBeTruthy();
      expect(backpack.checkItemById(item.id)).toBeTruthy();
    });

    test('should return false if backpack does not have item', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      expect(backpack.checkItem(item)).toBeFalsy();
      expect(backpack.checkItemById(testBackpackItemPayload.id)).toBeFalsy();
    });
  });

  describe('backpack add item interface', () => {
    test('should throw error when item quantity <= 0', () => {
      const handler = () => {
        const backpack = core.backpack;
        const item = new TestItem(testBackpackItemPayload);
        backpack.addItem(item, 0);
      };
      expect(() => handler()).toThrowError(
        `Fail to add ${testBackpackItemPayload.id} to backpack, quantity should > 0`
      );
    });

    test('should success add item by id', () => {
      const backpack = core.backpack;

      expect(backpack.checkItemById('LowSpiritMine')).toBeFalsy();
      backpack.addItemById('LowSpiritMine', 10);
      expect(backpack.checkItemById('LowSpiritMine')).toBeTruthy();
    });

    test('should success add new item ', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      expect(backpack.checkItem(item)).toBeFalsy();
      backpack.addItem(item, 10);
      expect(backpack.checkItem(item)).toBeTruthy();
    });

    test('should success add exsit item', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      backpack.addItem(item, 10);
      expect(backpack.getItem(item)?.quantity).toBe(10);
      backpack.addItem(item, 10);
      expect(backpack.getItem(item)?.quantity).toBe(20);
    });
  });

  describe('backpack reduce item interface', () => {
    test('should success reduce item quantity', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      backpack.addItem(item, 3);
      backpack.reduceItem(item, 1);

      expect(backpack.getItem(item)?.quantity).toBe(2);

      backpack.reduceItem(item, -1);
      expect(backpack.getItem(item)?.quantity).toBe(1);
    });

    test('should delete item if quantity <= 0', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      backpack.addItem(item, 1);
      backpack.reduceItem(item, 1);
      expect(backpack.checkItem(item)).toBeFalsy();
    });
  });

  describe('Sell interface', () => {
    test('should success run sellItem', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 10);

      expect(backpack.checkItem(item, 10)).toBeTruthy();

      const backpackItem = backpack.getItem(item)!;

      // sell one item
      backpack.sellItem(backpackItem, 1);
      expect(backpack.getItem(item)?.quantity).toBe(9);
      expect(bank.gold).toBe(5);

      // sell all item
      backpack.sellItem(backpackItem);
      expect(backpack.getItem(item)).toBeUndefined();
      expect(bank.gold).toBe(50);
    });
  });

  test('should set selected item', () => {
    const backpack = core.backpack;
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    const backpackItem = backpack.items.get(item)!;

    backpack.toggleSelectItem(backpackItem);
    expect(backpack.selectedItems.size).toBe(1);
    expect(backpack.selectedItems.has(backpackItem)).toBeTruthy();
    expect(backpack.selectedItemsPriceAmount).toEqual(item.price * 10);

    backpack.addSelectItem(backpackItem);
    expect(backpack.selectedItems.size).toBe(1);
    expect(backpack.selectedItems.has(backpackItem)).toBeTruthy();
    expect(backpack.selectedItemsPriceAmount).toEqual(item.price * 10);
  });

  describe('Backpack events', () => {
    test('should success listen EventKeys.Backpack.AddItem event', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);

      events.emit(EventKeys.Backpack.AddItem, item, 5);
      expect(backpack.checkItem(item, 5)).toBeTruthy();

      events.emit(EventKeys.Backpack.AddItem, item, 2);
      expect(backpack.checkItem(item, 7)).toBeTruthy();
    });

    test('should success listen EventKeys.Backpack.ReduceItem event', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 5);

      events.emit(EventKeys.Backpack.ReduceItem, item, 2);
      expect(backpack.getItem(item)?.quantity).toBe(3);

      events.emit(EventKeys.Backpack.ReduceItem, item, 2);
      expect(backpack.getItem(item)?.quantity).toBe(1);

      events.emit(EventKeys.Backpack.ReduceItem, item, 1);
      expect(backpack.checkItem(item)).toBeFalsy();
    });

    test('should success listen EventKeys.Backpack.SellItem event', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 5);

      events.emit(EventKeys.Backpack.SellItem, backpack.getItem(item), 2);
      expect(backpack.getItem(item)?.quantity).toBe(3);
      expect(bank.gold).toBe(10);

      events.emit(EventKeys.Backpack.SellItem, backpack.getItem(item), 2);
      expect(backpack.getItem(item)?.quantity).toBe(1);
      expect(bank.gold).toBe(20);

      events.emit(EventKeys.Backpack.SellItem, backpack.getItem(item), 2);
      expect(backpack.checkItem(item)).toBeFalsy();
      expect(bank.gold).toBe(25);
    });

    test('should success return items by type', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 5);
      backpack.addItemById('WoodSword', 10);
      backpack.addItemById('ClothHat', 10);

      expect(backpack.getItemsByType(ItemType.Test).length).toBe(1);
      expect(backpack.getItemsByType(ItemType.Equipment).length).toBe(2);
    });
  });
});
