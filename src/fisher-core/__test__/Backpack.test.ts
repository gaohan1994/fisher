/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { NormalItem, TestItem } from '../fisher-item';
import { Store } from '../fisher-packages';

let store: Store;
let core: FisherCore;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
  core.backpack.items.clear();
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
    test('should throw error when reduce item quantity === 0 or item does not exsit', () => {
      expect(() => {
        const backpack = core.backpack;
        const item = new TestItem(testBackpackItemPayload);
        backpack.reduceItem(item, 0);
      }).toThrowError(`Fail to reduce ${testBackpackItemPayload.id} x 0`);

      expect(() => {
        const backpack = core.backpack;
        const item = new TestItem(testBackpackItemPayload);
        backpack.reduceItem(item, 10);
      }).toThrowError(`Fail to reduce ${testBackpackItemPayload.id} x 10`);
    });

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

  describe('backpack sell interface', () => {
    test('should success sell item and reduce backpack item', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 10);
      const backpackItem = backpack.items.get(item);
      if (!backpackItem) return;
      expect(backpackItem.quantity).toBe(10);

      backpack.sellItem(backpackItem, 1);
      expect(backpack.items.get(item)?.quantity).toBe(9);
    });

    test('should delete item when sell backpack item all quantity', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 10);
      const backpackItem = backpack.items.get(item);
      if (!backpackItem) return;
      expect(backpackItem.quantity).toBe(10);
      backpack.sellItem(backpackItem, 10);
      expect(backpack.items.get(item)).toBeUndefined();
    });

    test('should success sell items and reduce backpack item', () => {
      const backpack = core.backpack;
      const item = new TestItem(testBackpackItemPayload);
      const item2 = new TestItem({
        ...testBackpackItemPayload,
        id: 'Test:Backpack:2',
      });

      backpack.addItem(item, 10);
      backpack.addItem(item2, 10);
      expect(backpack.items.size).toBe(2);
      backpack.sellItems(backpack.backpackItems);
      expect(backpack.items.size).toBe(0);
    });
  });

  test('should set selected item', () => {
    const backpack = core.backpack;
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    const backpackItem = backpack.items.get(item);
    if (!backpackItem) return;
    backpack.toggleSelectItem(backpackItem);
    expect(backpack.selectedItems.size).toBe(1);
    expect(backpack.selectedItems.has(backpackItem)).toBeTruthy();
  });
});
