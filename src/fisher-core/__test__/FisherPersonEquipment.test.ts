import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { FisherEquipmentItem, FisherEquipmentSlot } from '../fisher-item';
import { emptyEquipment } from '../fisher-packages';
import { FisherPersonEquipment } from '../fisher-person';

const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slots: [FisherEquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('FisherPersonEquipment', () => {
  test('should success initialize personEquipment', () => {
    const personEquipment = new FisherPersonEquipment({
      slot: FisherEquipmentSlot.Helmet,
    });
    expect(personEquipment.slot).toBe(FisherEquipmentSlot.Helmet);
    expect(personEquipment.emptyEquipment).toBe(emptyEquipment);
    expect(personEquipment.equipment).toBe(emptyEquipment);
    expect(personEquipment.isEmpty).toBeTruthy();
  });

  test('should success updateEquipment when prev equipment was empty', () => {
    const personEquipment = new FisherPersonEquipment({
      slot: FisherEquipmentSlot.Helmet,
    });
    expect(personEquipment.isEmpty).toBeTruthy();

    const equip = new FisherEquipmentItem(testEquipmentData);
    const { prevEquipment, prevQuantity } = personEquipment.updateEquipment(
      equip,
      2
    );
    expect(prevEquipment).toBe(emptyEquipment);
    expect(prevQuantity).toBe(0);
    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.quantity).toBe(2);
    expect(personEquipment.isEmpty).toBeFalsy();
  });

  test('should success updateEquipment when prev equipment was not empty', () => {
    const equip = new FisherEquipmentItem(testEquipmentData);
    const personEquipment = new FisherPersonEquipment({
      slot: FisherEquipmentSlot.Helmet,
      equipment: equip,
      quantity: 3,
    });
    const { prevEquipment, prevQuantity } = personEquipment.updateEquipment(
      equip,
      2
    );
    expect(prevEquipment).toBe(equip);
    expect(prevQuantity).toBe(3);
    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.quantity).toBe(2);
  });

  test('should fail to remove equipment when prev equipment was empty', () => {
    const personEquipment = new FisherPersonEquipment({
      slot: FisherEquipmentSlot.Helmet,
    });
    expect(() => personEquipment.removeEquipment()).toThrow(
      'Fail to remove equipment, current slot equipment was empty'
    );
  });

  test('should success to remove equipment when prev equipment was not empty', () => {
    const equip = new FisherEquipmentItem(testEquipmentData);
    const personEquipment = new FisherPersonEquipment({
      slot: FisherEquipmentSlot.Helmet,
      equipment: equip,
      quantity: 1,
    });
    const { prevEquipment, prevQuantity } = personEquipment.removeEquipment();
    expect(prevEquipment).toBe(equip);
    expect(prevQuantity).toBe(1);
    expect(personEquipment.equipment).toBe(emptyEquipment);
    expect(personEquipment.quantity).toBe(0);
  });
});
