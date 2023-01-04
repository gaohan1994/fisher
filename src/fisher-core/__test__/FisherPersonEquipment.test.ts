/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { createFisherStore } from '../fisher-packages';
import { PersonEquipment } from '../fisher-person';

const emptyEquipment = new EquipmentItem({
  id: 'EmptyEquipment',
  name: '空',
  desc: '',
  media: '',
  price: 0,
  slots: [EquipmentSlot.Helmet, EquipmentSlot.Weapon],
});
const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

beforeEach(async () => {
  await createFisherStore();
});

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slots: [EquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('PersonEquipment', () => {
  test('should success initialize personEquipment', () => {
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
    });
    expect(personEquipment.slot).toBe(EquipmentSlot.Helmet);
    expect(personEquipment.emptyEquipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.equipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.isEmpty).toBeTruthy();
  });

  test('should success updateEquipment when prev equipment was empty', () => {
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
    });
    expect(personEquipment.isEmpty).toBeTruthy();

    const equip = new EquipmentItem(testEquipmentData);
    const { prevEquipment, prevQuantity } = personEquipment.updateEquipment(
      equip,
      2
    );
    expect(prevEquipment).toStrictEqual(emptyEquipment);
    expect(prevQuantity).toBe(0);
    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.quantity).toBe(2);
    expect(personEquipment.isEmpty).toBeFalsy();
  });

  test('should success updateEquipment when prev equipment was not empty', () => {
    const equip = new EquipmentItem(testEquipmentData);
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
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
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
    });
    expect(() => personEquipment.removeEquipment()).toThrow(
      'Fail to remove equipment, current slot equipment was empty'
    );
  });

  test('should success to remove equipment when prev equipment was not empty', () => {
    const equip = new EquipmentItem(testEquipmentData);
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
      equipment: equip,
      quantity: 1,
    });
    const { prevEquipment, prevQuantity } = personEquipment.removeEquipment();
    expect(prevEquipment).toBe(equip);
    expect(prevQuantity).toBe(1);
    expect(personEquipment.equipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.quantity).toBe(0);
  });
});
