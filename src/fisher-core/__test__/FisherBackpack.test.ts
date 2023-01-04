/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { TestItem } from '../fisher-item';

const fisherGold = {
  receiveGold: vi.fn(),
};

vi.stubGlobal('fisher', { fisherGold });

const testBackpackItemPayload = {
  id: 'Test:Backpack',
  name: 'Test:BackpackItemName',
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
};

describe('Backpack', () => {
  test('backpack should be empty when initialize', () => {
    const backpack = new Backpack();
    expect(backpack.items.size).toBe(0);
  });

  test('should throw error when item quantity <= 0', () => {
    const handler = () => {
      const backpack = new Backpack();
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 0);
    };
    expect(() => handler()).toThrowError(
      'Fail to add item to backpack, quantity should > 0'
    );
  });

  test('should success add new item to backpack', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    expect(backpack.items.size).toBe(1);
    expect(backpack.items.get(item)?.quantity).toBe(10);
  });

  test('should add item quantity when item already in backpack', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    expect(backpack.items.get(item)?.quantity).toBe(10);
    backpack.addItem(item, 10);
    expect(backpack.items.get(item)?.quantity).toBe(20);
  });

  test('should throw error when reduce item quantity <= 0', () => {
    const handler = () => {
      const backpack = new Backpack();
      const item = new TestItem(testBackpackItemPayload);
      backpack.addItem(item, 10);
      backpack.reduceItem(item, 0);
    };
    expect(() => handler()).toThrowError(
      'Fail to reduce backpack item, quantity should > 0'
    );
  });

  test('should throw error when reduce item does not exist', () => {
    const handler = () => {
      const backpack = new Backpack();
      const item = new TestItem(testBackpackItemPayload);
      backpack.reduceItem(item, 10);
    };
    expect(() => handler()).toThrowError(
      'Fail to reduce backpackItem quantity, backpackItem undefined'
    );
  });

  test('should success reduce item in backpack', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    expect(backpack.items.get(item)?.quantity).toBe(10);
    backpack.reduceItem(item, 9);
    expect(backpack.items.get(item)?.quantity).toBe(1);
  });

  test('should delete item when reduce quantity >= backpack item quantity', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    expect(backpack.items.get(item)?.quantity).toBe(10);
    backpack.reduceItem(item, 11);
    expect(backpack.items.get(item)).toBeUndefined();
  });

  test('should success sell item and reduce backpack item', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    const backpackItem = backpack.items.get(item);
    if (!backpackItem) return;
    expect(backpackItem.quantity).toBe(10);

    backpack.sellItem(backpackItem, 1);
    expect(backpack.items.get(item)?.quantity).toBe(9);
  });

  test('should delete item when sell backpack item all quantity', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    const backpackItem = backpack.items.get(item);
    if (!backpackItem) return;
    expect(backpackItem.quantity).toBe(10);
    backpack.sellItem(backpackItem, 10);
    expect(backpack.items.get(item)).toBeUndefined();
  });

  test('should success sell items and reduce backpack item', () => {
    const backpack = new Backpack();
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

  test('should set selected item', () => {
    const backpack = new Backpack();
    const item = new TestItem(testBackpackItemPayload);
    backpack.addItem(item, 10);
    const backpackItem = backpack.items.get(item);
    if (!backpackItem) return;
    backpack.toggleSelectItem(backpackItem);
    expect(backpack.selectedItems.size).toBe(1);
    expect(backpack.selectedItems.has(backpackItem)).toBeTruthy();
  });
});
